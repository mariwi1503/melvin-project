"use strict";

const salaryModel = require("../models/salaryModel");
const validation = require("../utils/validation");
const exceljs = require("exceljs");
const moment = require("moment");
const PDFDocument = require("pdfkit");
const { pphCodeEnum } = require("../utils/constant");

module.exports = {
  getAllSalaryData: async (req, res) => {
    try {
      let { month, year, employeeName, pphCode } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      if (pphCode && !pphCodeEnum.includes(pphCode))
        throw new Error("Kode PPH tidak sesuai");
      if (month && typeof month !== "number" && isNaN(month))
        throw new Error("Bulan harus berupa angka");
      if (year && typeof year !== "number" && isNaN(year))
        throw new Error("Tahun harus berupa angka");

      const salaries = await salaryModel.getSalaries(
        limit,
        offset,
        month,
        year,
        employeeName,
        pphCode
      );
      if (salaries.length === 0) {
        if (month && !year && !employeeName) {
          throw new Error(
            `Data gaji karyawan di bulan ${month} tidak ditemukan`
          );
        } else if (!month && year && !employeeName) {
          throw new Error(
            `Data gaji karyawan di tahun ${year} tidak ditemukan`
          );
        } else if (!month && !year && employeeName) {
          throw new Error(
            `Data gaji karyawan dengan nama ${employeeName} tidak ditemukan`
          );
        } else {
          throw new Error(`Data gaji karyawan tidak ditemukan`);
        }
      }
      res.status(200).json({
        status: 200,
        success: true,
        data: salaries,
        message: "Successfuly fetching data",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        success: false,
        message: error.message,
      });
    }
  },
  getSalaryDataById: async (req, res) => {
    try {
      const id = req.params.id;
      if (typeof id !== "number" && isNaN(id))
        throw new Error("ID harus berupa angka");
      const salary = await salaryModel.getSalaryById(+id);
      if (!salary) throw new Error(`Data gaji karyawan tidak ditemukan`);
      res.status(200).json({
        status: 200,
        success: true,
        data: salary,
        message: "Successfuly fetching data",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        success: false,
        message: error.message,
      });
    }
  },
  insertSalaryData: async (req, res) => {
    try {
      const payload = await validation.insertSalaryDataSchema.validateAsync(
        req.body
      );
      // insert data to database
      const data = await salaryModel.insertSalaryData(payload);
      res.status(200).json({
        status: 200,
        success: true,
        data,
        message: "Successfuly insert data",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        success: false,
        message: error.message,
      });
    }
  },
  updateSalaryData: async (req, res) => {
    try {
      const id = req.params.id;
      const payload = await validation.updateSalaryDataSchema.validateAsync(
        req.body
      );
      if (typeof id !== "number" && isNaN(id))
        throw new Error("ID harus berupa angka");
      const salary = await salaryModel.getSalaryById(+id);
      if (!salary) throw new Error(`Data gaji karyawan tidak ditemukan`);

      // update data in database
      await salaryModel.updateSalaryData(id, payload);
      res.status(200).json({
        status: 200,
        success: true,
        message: "Successfuly update data",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        success: false,
        message: error.message,
      });
    }
  },
  deleteSalaryData: async (req, res) => {
    try {
      const id = req.params.id;
      if (typeof id !== "number" && isNaN(id))
        throw new Error("ID harus berupa angka");

      const salary = await salaryModel.getSalaryById(+id);
      if (!salary) throw new Error(`Data gaji karyawan tidak ditemukan`);

      // delete data
      await salaryModel.deleteSalaryData(+id);
      res.status(200).json({
        status: 200,
        success: true,
        message: "Successfuly delete data",
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        success: false,
        message: error.message,
      });
    }
  },
  exportToExcel: async (req, res) => {
    try {
      const exportType = req.params.exportType;
      if (exportType !== "pdf" && exportType !== "excel")
        throw new Error("Invalid export format");

      const salaries = await salaryModel.getSalaries();
      if (salaries.length === 0) throw new Error("Tidak ada data gaji");

      let workBook = new exceljs.Workbook();
      const sheet = workBook.addWorksheet("Data");

      sheet.columns = [
        { header: "NO.", key: "no", width: 5 },
        { header: "NAMA", key: "nama_karyawan", width: 30 },
        { header: "JML PENGHASILAN", key: "jumlah_penghasilan", width: 20 },
        { header: "KODE PPH21", key: "kode_pph21", width: 30 },
        { header: "NOMINAL PPH21", key: "nominal_pph21", width: 20 },
        { header: "PTKP TAHUNAN", key: "ptkp_tahunan", width: 20 },
        {
          header: "DASAR PENGENAAN PAJAK",
          key: "dasar_pengenaan_pajak",
          width: 30,
        },
        { header: "TARIF", key: "tarif", width: 20 },
        { header: "TAKE HOMEPAY", key: "nominal_takehomepay", width: 20 },
        { header: "PERIODE", key: "periode", width: 15 },
      ];

      await salaries.map((x, i) => {
        sheet.addRow({
          no: i + 1,
          nama_karyawan: x.nama_karyawan,
          jumlah_penghasilan:
            "Rp " + new Intl.NumberFormat("id-ID").format(x.jumlah_penghasilan),
          kode_pph21: x.kode_pph21,
          nominal_pph21:
            "Rp " + new Intl.NumberFormat("id-ID").format(x.nominal_pph21),
          ptkp_tahunan:
            "Rp " + new Intl.NumberFormat("id-ID").format(x.ptkp_tahunan),
          dasar_pengenaan_pajak:
            "Rp " +
            new Intl.NumberFormat("id-ID").format(x.dasar_pengenaan_pajak),
          tarif: "Rp " + new Intl.NumberFormat("id-ID").format(x.tarif),
          nominal_takehomepay:
            "Rp " +
            new Intl.NumberFormat("id-ID").format(x.nominal_takehomepay),
          periode: moment(x.periode).format("YYYY-MM-DD"),
        });
      });

      const headerRow = sheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.font = { size: 12, bold: true };
        cell.alignment = { horizontal: "center" };
      });

      // Apply styling to data rows
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.eachCell((cell) => {
            cell.font = { size: 11 };
          });
        }
      });

      let a = 1;

      if (exportType === "excel") {
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "atatchment;filename=" + "data gaji.xlsx"
        );

        await workBook.xlsx.write(res);
      } else {
        const pdfDoc = new PDFDocument();
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'inline; filename="Data.pdf"');

        // Set initial position for text
        let xPos = 0;
        let yPos = 50;

        sheet.eachRow((row, rowNumber) => {
          row.eachCell((cell, colNumber) => {
            let width = 50;
            switch (colNumber) {
              case 1:
                pdfDoc
                  .fontSize(7)
                  .text(cell.text, xPos, yPos, { width, align: "center" });
                xPos += 40;
                break;
              case 2:
                pdfDoc
                  .fontSize(7)
                  .text(cell.text, xPos, yPos, { width: 70, align: "center" });
                xPos += 70;
                break;
              case 3:
                pdfDoc
                  .fontSize(7)
                  .text(cell.text, xPos, yPos, { width, align: "center" });
                xPos += 70;
                break;
              case 4:
                pdfDoc
                  .fontSize(7)
                  .text(cell.text, xPos, yPos, { width, align: "center" });
                xPos += 60;
                break;
              case 5:
                pdfDoc
                  .fontSize(7)
                  .text(cell.text, xPos, yPos, { width, align: "center" });
                xPos += 60;
                break;
              case 6:
                pdfDoc
                  .fontSize(7)
                  .text(cell.text, xPos, yPos, { width, align: "center" });
                xPos += 60;
                break;
              case 7:
                pdfDoc
                  .fontSize(7)
                  .text(cell.text, xPos, yPos, { width, align: "center" });
                xPos += 60;
                break;
              case 8:
                pdfDoc
                  .fontSize(7)
                  .text(cell.text, xPos, yPos, { width, align: "center" });
                xPos += 60;
                break;
              case 9:
                pdfDoc
                  .fontSize(7)
                  .text(cell.text, xPos, yPos, { width, align: "center" });
                xPos += 60;
                break;
              case 10:
                pdfDoc
                  .fontSize(7)
                  .text(cell.text, xPos, yPos, { width, align: "center" });
                xPos += 60;
                break;
            }
          });
          if (rowNumber === 1) {
            yPos += 30;
          } else {
            yPos += 20;
          }
          xPos = 0; // Reset x position for next row
        });

        pdfDoc.end();
        pdfDoc.pipe(res);
      }
    } catch (error) {
      res.status(400).json({
        status: 400,
        success: false,
        message: error.message,
      });
    }
  },
};
