import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"

import * as ExternalPlugin from "./.quartz/plugins"

/*
* Alters the Explorer hierarchy to properly handle integers.
* This results in 2, 1, 0, -1, -2, -3, etc.
* as opposed to -1, -2, -3, 0, 1, 2
*/
ExternalPlugin.Explorer({
  sortFn: (a, b) => {
    // Folders before files
    if (a.isFolder && !b.isFolder) return -1
    if (!a.isFolder && b.isFolder) return 1

    const nameA = (a.displayName || a.name || "").trim()
    const nameB = (b.displayName || b.name || "").trim()

    // Extract number
    const numRegex = /-?\d+\.?\d*/
    const matchA = nameA.match(numRegex)
    const matchB = nameB.match(numRegex)

    if (matchA && matchB) {
      const numA = parseFloat(matchA[0])
      const numB = parseFloat(matchB[0])
      
      if (numA !== numB) {
        return numB - numA
      }
    }

    // Fallback to normal alphabetical sorting
    return nameA.localeCompare(nameB, undefined, { numeric: true })
  }
})

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
