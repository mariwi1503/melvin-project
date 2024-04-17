const Joi = require('@hapi/joi')

module.exports = {
    insertSalaryDataSchema: Joi.object({
        nama_karyawan: Joi.string().required(),
        periode: Joi.date().required(),
        jumlah_penghasilan: Joi.number().required(),
        kode_pph21: Joi.string().valid('21-100-01 Pegawai Tetap', '21-100-07 Tenaga Ahli').required(),
        ptkp_tahunan: Joi.number().required(),
        dasar_pengenaan_pajak: Joi.number().optional(),
        tarif: Joi.number().optional(),
        nominal_pph21: Joi.number().optional(),
        nominal_takehomepay: Joi.number().optional(),
    }),
    updateSalaryDataSchema: Joi.object({
        nama_karyawan: Joi.string().optional(),
        periode: Joi.date().optional(),
        jumlah_penghasilan: Joi.number().optional(),
        kode_pph21: Joi.string().valid('21-100-01 Pegawai Tetap', '21-100-07 Tenaga Ahli').optional(),
        ptkp_tahunan: Joi.number().optional(),
        dasar_pengenaan_pajak: Joi.number().optional(),
        tarif: Joi.number().optional(),
        nominal_pph21: Joi.number().optional(),
        nominal_takehomepay: Joi.number().optional(),
    }),
}