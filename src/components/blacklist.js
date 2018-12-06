// Update 'tagsBlacklist' let
document.getElementById('updateBlacklistBtn').addEventListener('click', (event) => {
  event.preventDefault()
  tagsBlacklist = ''
  let ChipsData = M.Chips.getInstance(chips).chipsData
  if (ChipsData.length > 1) {
    let i = 1
    ChipsData.forEach(data => {
      if (ChipsData.length === i) {
        console.log(data.tag)
        tagsBlacklist += `-${data.tag}`
      } else {
        console.log(data.tag)
        tagsBlacklist += `-${data.tag}+`
      }
      i++
    })
  } else if (ChipsData.length === 1) {
    tagsBlacklist += `-${ChipsData[0].tag}`
  }

  M.toast({ html: 'Blacklist updated !' })
})
