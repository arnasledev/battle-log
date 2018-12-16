import path from 'path'
import fs from 'fs'
import csvToArray from 'csv-to-array'
import del from 'del'
import mongoose from 'mongoose'

const BattlesModel = mongoose.model('Battles')

class converter {
    constructor() {
        this.uploadsDir = path.join(__dirname, '../../uploads/')
        this.uploadFiles = ['battles.csv']
    }

    check() {
        if (fs.existsSync(this.uploadsDir)){
            const storedFiles = fs.readdirSync(this.uploadsDir)
            .map(file => this.uploadFiles.includes(file) ? file : false)
            .filter(v => !!v)

            if (storedFiles.length !== 0) {
                return this.upload(storedFiles)
            }
        }
    }

    upload(files) {
        console.log('-----------------------------------')
        console.log('First time launching APP.')
        console.log('Uploading missing files', files)

        // as far as we know there will be only one file.
        // this wont execute additional files. Need to refactor for that
        const columns = ['name', 'year', 'battle_number', 'attacker_king', 'defender_king',
            'attacker_1', 'attacker_2', 'attacker_3', 'attacker_4', 'defender_1', 'defender_2',
            'defender_3', 'defender_4', 'attacker_outcome', 'battle_type', 'major_death',
            'major_capture', 'attacker_size', 'defender_size', 'attacker_commander',
            'defender_commander', 'summer', 'location', 'region', 'note']
        const file = this.uploadsDir + files[0]

        return new csvToArray({ columns, file }, async (err, data) => {
            if (err) {
                console.error('Error while fetching CSV data')
                return false
            }

            await data.shift()
            await data.map(value => {
                return new BattlesModel(value).save()
            })


            const deletedPaths = await del([this.uploadsDir + '**'])
            console.log('Deleting files and folders:\n', deletedPaths.join('\n'))
            console.log('-----------------------------------')
        })
    }
}

module.exports = new converter