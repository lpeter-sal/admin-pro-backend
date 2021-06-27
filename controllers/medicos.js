const { response } = require('express');

const Medico = require('../models/medico');

const getMedico = async (req, res = response) => {

    const medicos = await Medico.find()
                                     .populate('usuario', 'nombre img')
                                     .populate('hospital', 'nombre img');

    res.json({
        ok: true,
        medicos
    })
}

const crearMedico = async (req, res = response) => {
    const uid = req.uid;
    const medico = new Medico ( {
        usuario: uid,
        ...req.body
    } );

    try {

        const medicoDB = await medico.save();


        res.json({
            ok: true,
            medico: medicoDB
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado'
        });
    }
}

const actualizarMedico = async (req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        const medico = await Medico.findById(id);

        if( !medico ){
            res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por ID'
            });  
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new:true });
        
        res.json({
            ok: true,
            medico: medicoActualizado
        });
    } catch (error) {
        res.status(500).json({
            ok: true,
            msg: 'Comuniquese con el administrador.'
        })
    }


}

const borrarMedico = async (req, res = response) => {
    const id = req.params.id;

    try {
        const medico = await Medico.findById(id);

        if( !medico ){
            res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por ID'
            });  
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            mmsg: 'Medico Eliminado.' 
        });
    } catch (error) {
        res.status(500).json({
            ok: true,
            msg: 'Comuniquese con el administrador.'
        })
    }
}




module.exports = {
    getMedico,
    crearMedico,
    actualizarMedico,
    borrarMedico
}