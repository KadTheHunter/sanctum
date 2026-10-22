import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { componentRegistry } from "./quartz/components"
import type { ExplorerOptions } from "@quartz-community/explorer"

// Use the componentRegistry workaround instead of ExternalPlugin.Explorer
/*
* Alters the Explorer hierarchy to properly handle integers.
* This results in 2, 1, 0, -1, -2, -3, etc.
* as opposed to -1, -2, -3, 0, 1, 2
*/
componentRegistry.setOptionOverrides("@quartz-community/explorer", {
  sortFn: (a: any, b: any) => {
    
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
} as Partial<ExplorerOptions>)

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
