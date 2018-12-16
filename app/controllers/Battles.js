import mongoose from 'mongoose'

const BattlesModel = mongoose.model('Battles')
const getBattlesList = async (req, res) => {
    const battles = await BattlesModel
    .find()
    .select(['location', 'region'])
    .exec()

    const data = battles
    .map(v => v.location.length > 0
        ? `${v.location} (${v.region})` : false)
    .filter(v => !!v)
    .reduce((x, y) => x.includes(y) ? x : [...x, y], [])

    return res.send({ success: true, data })
}

const countBattles = async (req, res) => {
    const data = await BattlesModel.countDocuments()
    return res.send({ success: true, data })
}

const getStatistics = async (req, res) => {
    const battles = await BattlesModel
    .find()
    .select(['attacker_king', 'defender_king', 'region', 'name', 'attacker_outcome', 'battle_type',
        'defender_size'])
    .exec()

    let attackers = {}
    let defenfers = []
    let regions = []
    let battlesNames = []
    let attackerOutcomeTotal = { win: 0, lose: 0 }
    let battleTypes = []
    let defenderSizes = []

    const data = {
        'attacker_king': attackers
    }

    return res.send({ success: true, data })
}

module.exports = { getBattlesList, countBattles, getStatistics }