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
    const attackerOutcome = {
        win: await BattlesModel.find({ attacker_outcome: 'win' }).countDocuments(),
        loss: await BattlesModel.find({ attacker_outcome: 'loss' }).countDocuments()
    }

    let attackers = []
    let defenders = []
    let regions = []
    let battlesNames = []
    let battleTypes = []
    let defenderSizes = []

    await battles.map(value => {
        attackers.push(value.attacker_king)
        defenders.push(value.defender_king)
        regions.push(value.region)
        battlesNames.push(value.name)
        battleTypes.push(value.battle_type)
        defenderSizes.push(value.defender_size)
    })

    defenderSizes = await defenderSizes.filter(v => !!v)
    const data = {
        'attacker_king': getBiggestOccurrence(attackers),
        'defender_king': getBiggestOccurrence(defenders),
        'region': getBiggestOccurrence(regions),
        'name': getBiggestOccurrence(battlesNames),
        attackerOutcome,
        'battle_type': battleTypes.filter((v, i, a) => (v && a.indexOf(v) === i)),
        'defender_size': {
            average: (defenderSizes.reduce((p, c) => p + c, 0) / defenderSizes.length).toFixed(2),
            min: Math.min(...defenderSizes),
            max: Math.max(...defenderSizes),
        }
    }

    return res.send({ success: true, data })
}

const searchBattles = async (req, res) => {
    let availableSearchCriteria = Object.keys(BattlesModel.schema.paths)
    .filter(v => v.charAt(0) !== '_')
    const { query } = req

    if (!query || !Object.keys(query).length) {
        return res.status(404).send({ success: false })
    }

    availableSearchCriteria.push('king')
    const searchQuery = await BattlesModel.buildSearchQuery(query, availableSearchCriteria)
    const searchResults = await BattlesModel.find({ '$and': searchQuery })

    const data = await Promise.all(searchResults).then(value => {
        return value
    })
    return res.send({ success: true, data })
}

const getBiggestOccurrence = data => {
    return data.sort((a, b) =>
        data.filter(v => v === a).length - data.filter(v => v === b).length).pop()
}

module.exports = { getBattlesList, countBattles, getStatistics, searchBattles }