import { execFile } from 'child_process'
import { get } from 'electron-settings'

import { exePath } from '@/utils/Settings.js'
  
export const execute = async () => {
    const gameExePath = await get(exePath)
    execFile(gameExePath)
}