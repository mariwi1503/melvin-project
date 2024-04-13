"use strict";

const salaryModel = require('../models/salaryModel')
const validation = require('../validation')

module.exports = {
    getAllSalaryData: async (req, res) => {
        try {
            const {month,year, employeeName} = req.query
            if (month) {
                if (typeof month !== 'number' && isNaN(month)) throw new Error('Bulan harus berupa angka')
            }
            if (year) {
                if (typeof year !== 'number' && isNaN(year)) throw new Error('Tahun harus berupa angka')
            }
            const salaries = await salaryModel.getSalaries(month, year, employeeName)
            if (salaries.length === 0) {
                if (month && !year && !employeeName) {
                    throw new Error(`Data gaji karyawan di bulan ${month} tidak ditemukan`)
                } else if (!month && year && !employeeName) {
                    throw new Error(`Data gaji karyawan di tahun ${year} tidak ditemukan`)
                } else if (!month && !year && employeeName) {
                    throw new Error(`Data gaji karyawan dengan nama ${employeeName} tidak ditemukan`)
                } else {throw new Error(`Data gaji karyawan tidak ditemukan`)}
            }
            res.status(200).json({
                status: 200,
                success: true,
                data: salaries,
                message: 'Successfuly fetching data'
            })
        } catch (error) {
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message
            })
        }
    },
    getSalaryDataById: async (req, res) => {
        try {
            const id = req.params.id
            if (typeof id !== 'number' && isNaN(id)) throw new Error('ID harus berupa angka')
            const salary = await salaryModel.getSalaryById(+id)
            if (!salary) throw new Error(`Data gaji karyawan tidak ditemukan`)
            res.status(200).json({
                status: 200,
                success: true,
                data: salary,
                message: 'Successfuly fetching data'
            })
        } catch (error) {
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message
            })
        }
    },
    insertSalaryData: async (req, res) => {
        try {
            const payload = await validation.insertSalaryDataSchema.validateAsync(req.body)
            // insert data to database
            const data = await salaryModel.insertSalaryData(payload)            
            res.status(200).json({
                status: 200,
                success: true,
                data,
                message: 'Successfuly fetching data'
            })
        } catch (error) {
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message
            })
        }
    },
    updateSalaryData: async (req, res) => {
        try {
            const id = req.params.id
            const payload = await validation.updateSalaryDataSchema.validateAsync(req.body)
            if (typeof id !== 'number' && isNaN(id)) throw new Error('ID harus berupa angka')
            const salary = await salaryModel.getSalaryById(+id)
            if (!salary) throw new Error(`Data gaji karyawan tidak ditemukan`)

            // update data in database
            await salaryModel.updateSalaryData(id, payload)            
            res.status(200).json({
                status: 200,
                success: true,
                message: 'Successfuly update data'
            })
        } catch (error) {
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message
            })
        }
    },
    deleteSalaryData: async (req, res) => {
        try {
            const id = req.params.id
            if (typeof id !== 'number' && isNaN(id)) throw new Error('ID harus berupa angka')

            const salary = await salaryModel.getSalaryById(+id)
            if (!salary) throw new Error(`Data gaji karyawan tidak ditemukan`)

            // delete data
            await salaryModel.deleteSalaryData(+id)
            res.status(200).json({
                status: 200,
                success: true,
                message: 'Successfuly delete data'
            })
        } catch (error) {
            res.status(400).json({
                status: 400,
                success: false,
                message: error.message
            })
        }
    }
}