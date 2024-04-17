"use strict";

const { poolTwo } = require("../db/connection");

module.exports = {
  getSalaries: async (limit, offset, month, year, employeeName, pphCode) => {
    try {
      let query = `SELECT * FROM jurnal_ars_gaji_karyawan`;
      let queryParams = [];

      if (year && employeeName && month && pphCode) {
        query += ` WHERE YEAR(periode) = ?
        AND MONTH(periode) = ?
        AND LOWER(nama_karyawan) LIKE LOWER(?)
        AND kode_pph21 = ?`;

        queryParams = [year, month, `%${employeeName}%`, pphCode];
      } else if (year && month && employeeName) {
        query += ` WHERE YEAR(periode) = ?
        AND MONTH(periode) = ?
        AND LOWER(nama_karyawan) LIKE LOWER(?)`;

        queryParams = [year, month, `%${employeeName}%`];
      } else if (year && month && pphCode) {
        query += ` WHERE YEAR(periode) = ?
        AND MONTH(periode) = ?
        AND kode_pph21 = ?`;

        queryParams = [year, month, pphCode];
      } else if (year && employeeName && pphCode) {
        query += ` WHERE YEAR(periode) = ?
        AND LOWER(nama_karyawan) LIKE LOWER(?)
        AND kode_pph21 = ?`;

        queryParams = [year, `%${employeeName}%`, pphCode];
      } else if (month && employeeName && pphCode) {
        query += ` WHERE MONTH(periode) = ?
        AND LOWER(nama_karyawan) LIKE LOWER(?)
        AND kode_pph21 = ?`;

        queryParams = [month, `%${employeeName}%`, pphCode];
      } else if (year && month) {
        query += ` WHERE YEAR(periode) = ?
        AND MONTH(periode) = ?`;

        queryParams = [year, month];
      } else if (year && employeeName) {
        query += ` WHERE YEAR(periode) = ?
        AND LOWER(nama_karyawan) LIKE LOWER(?)`;

        queryParams = [year, `%${employeeName}%`];
      } else if (year && pphCode) {
        query += ` WHERE YEAR(periode) = ?
        AND kode_pph21 = ?`;

        queryParams = [year, pphCode];
      } else if (month && employeeName) {
        query += ` WHERE MONTH(periode) = ? AND LOWER(nama_karyawan) LIKE LOWER(?)`;

        queryParams = [month, `%${employeeName}%`];
      } else if (pphCode && month) {
        query += ` WHERE MONTH(periode) = ? AND kode_pph21 = ?`;

        queryParams = [month, pphCode];
      } else if (pphCode && employeeName) {
        query += ` WHERE LOWER(nama_karyawan) LIKE LOWER(?) AND kode_pph21 = ?`;

        queryParams = [`%${employeeName}%`, pphCode];
      } else if (year) {
        query += ` WHERE YEAR(periode) = ?`;

        queryParams = [year];
      } else if (month) {
        query += ` WHERE MONTH(periode) = ?`;

        queryParams = [month];
      } else if (employeeName) {
        query += ` WHERE LOWER(nama_karyawan) LIKE LOWER(?)`;

        queryParams = [`%${employeeName}%`];
      } else if (pphCode) {
        query += ` WHERE kode_pph21 = ?`;

        queryParams = [pphCode];
      }

      if (limit && offset) {
        query += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
        queryParams.push(limit, offset);
      }

      const [rows] = await poolTwo.query(query, queryParams);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  getSalaryById: async (id) => {
    try {
      const [[rows]] = await poolTwo.query(
        `SELECT * FROM jurnal_ars_gaji_karyawan WHERE ID = ?`,
        id
      );
      return rows;
    } catch (error) {
      throw error;
    }
  },
  insertSalaryData: async (data) => {
    try {
      const query = `INSERT INTO jurnal_ars_gaji_karyawan set ?`;
      const [rows, fields] = await poolTwo.query(query, data);
      return rows.insertId;
    } catch (error) {
      throw error;
    }
  },
  updateSalaryData: async (id, data) => {
    try {
      const query = `UPDATE jurnal_ars_gaji_karyawan SET ? WHERE ID = ?`;
      const [rows, fields] = await poolTwo.query(query, [data, id]);
      return;
    } catch (error) {
      throw error;
    }
  },
  deleteSalaryData: async (id) => {
    try {
      const [rows, fields] = await poolTwo.query(
        `DELETE FROM jurnal_ars_gaji_karyawan jurnal_ars_gaji_karyawan WHERE ID = ?`,
        id
      );
      return;
    } catch (error) {
      throw error;
    }
  },
};
