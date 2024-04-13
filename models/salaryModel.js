"use strict";

const {poolTwo} = require('../db/connection')

module.exports = {
    getSalaries: async (month, year, employeeName) => {
        try {
            let query = ''
            let queryParams = []

            if (year && employeeName && month) {
                query = `
                SELECT *
                FROM jurnal_ars_gaji_karyawan
                WHERE YEAR(periode) = ?
                AND MONTH(periode) = ?
                AND LOWER(nama_karyawan) LIKE LOWER(?)`
                queryParams = [year, month,`%${employeeName}%`]
            } else if (year && employeeName) {
                query = `
                SELECT *
                FROM jurnal_ars_gaji_karyawan
                WHERE YEAR(periode) = ?
                AND LOWER(nama_karyawan) LIKE LOWER(?)`
                queryParams = [year, `%${employeeName}%`]
            } else if (year && month) {
                query = `
                SELECT *
                FROM jurnal_ars_gaji_karyawan
                WHERE YEAR(periode) = ?
                AND MONTH(periode) = ?`
                queryParams = [year, month]
            } else if (month && employeeName) {
                query = `
                SELECT *
                FROM jurnal_ars_gaji_karyawan
                WHERE MONTH(periode) = ?
                AND LOWER(nama_karyawan) LIKE LOWER(?)`
                queryParams = [month, `%${employeeName}%`]
            }else if (year) {
                query = `
                SELECT *
                FROM jurnal_ars_gaji_karyawan
                WHERE YEAR(periode) = ?`
                queryParams = [year]
            } else if (employeeName) {
                query = `
                SELECT *
                FROM jurnal_ars_gaji_karyawan
                WHERE LOWER(nama_karyawan) LIKE LOWER(?)`
                queryParams = [`%${employeeName}%`]
            } else if(month) {
                query = `
                SELECT *
                FROM jurnal_ars_gaji_karyawan
                WHERE MONTH(periode) = ?`
                queryParams = [month]
            } else {
                query = `SELECT * FROM jurnal_ars_gaji_karyawan`
            }
            const [rows] = await poolTwo.query(query, queryParams)
            return rows
        } catch (error) {
            throw error
        }
    },
    getSalaryById: async (id) => {
        try {
            const [[rows]] = await poolTwo.query(`SELECT * FROM jurnal_ars_gaji_karyawan WHERE ID = ?`, id)
            return rows
        } catch (error) {
            throw error
        }
    },
    insertSalaryData: async (data) => {
        try {
            const query = `INSERT INTO jurnal_ars_gaji_karyawan set ?`
            const [rows, fields] = await poolTwo.query(query, data)
            return rows.insertId
        } catch (error) {
            throw error
        }
    },
    updateSalaryData: async (id, data) => {
        try {
            const query = `UPDATE jurnal_ars_gaji_karyawan SET ? jurnal_ars_gaji_karyawan`
            const [rows, fields] = await poolTwo.query(query, [data, id])
            return
        } catch (error) {
            throw error
        }
    },
    deleteSalaryData: async (id) => {
        try {
            const [rows, fields] = await poolTwo.query(`DELETE FROM jurnal_ars_gaji_karyawan jurnal_ars_gaji_karyawan WHERE ID = ?`, id)
            return
        } catch (error) {
            throw error
        }
    }
    
}