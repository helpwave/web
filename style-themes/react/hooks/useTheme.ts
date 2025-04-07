import { useContext } from 'react'
import { ThemeProvider } from '../components/ThemeProvider'

export const useTheme = () => useContext(ThemeProvider)
