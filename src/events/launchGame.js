import { execFile } from 'child_process'
import { get } from 'electron-settings'

import { gamePath } from '@/utils/Settings.js'
  
export const execute = async () => {
    const gameExePath = await get(gamePath)
    execFile(gameExePath)
}