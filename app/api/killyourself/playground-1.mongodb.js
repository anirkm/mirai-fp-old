use("prod-clans2")
let collection = db.getCollection("clans")

let activeClans = collection
  .find({})
  .toArray()
  .map((clan) => {
    return `${clan.clanId} <@&${clan.clanRole}>`
  })

console.log(activeClans.join("\n"))
