const mongoose = require('mongoose')

const Schema = mongoose.Schema

/**
 * Battles Schema
 */

const schemaDetails = {
    name: { type: String, default: '' },
    year: { type: Number, default: 0 },
    battle_number: { type: Number, default: 0 },
    attacker_king: { type: String },
    defender_king: { type: String },
    attacker_1: { type: String },
    attacker_2: { type: String },
    attacker_3: { type: String },
    attacker_4: { type: String },
    defender_1: { type: String },
    defender_2: { type: String },
    defender_3: { type: String },
    defender_4: { type: String },
    attacker_outcome: { type: String },
    battle_type: { type: String, enum: ['pitched battle', 'ambush', 'siege', 'razing', ''] },
    major_death: { type: Number, default: 0 },
    major_capture: { type: Number, default: 0 },
    attacker_size: { type: Number, default: 0 },
    defender_size: { type: Number, default: 0 },
    attacker_commander: { type: String },
    defender_commander: { type: String },
    summer: { type: Number, default: 0 },
    location: { type: String },
    region: { type: String },
    note: { type: String },
}
const BattleSchema = new Schema(schemaDetails)

/**
 * Validations
 */

BattleSchema.path('name').required(true, 'Battle name cannot be blank')
BattleSchema.path('year').required(true, 'Battle year cannot be blank')


BattleSchema.statics.buildSearchQuery = (params, availableSearchParams) => {
    let searchParams = []
    for (let key in params) {
        if (availableSearchParams.includes(key)) {
            if (key === 'king') {
                searchParams.push({ '$or': [{ attacker_king: params[key] }, { defender_king: params[key] }] })
            } else {
                searchParams.push({ [key]: params[key] })
            }
        }
    }

    return searchParams
}

mongoose.model('Battles', BattleSchema, 'battles')