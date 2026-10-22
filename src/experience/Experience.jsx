import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getTheme, themeVars } from '../data/themes'
import { normalizeGift } from '../data/options'
import { lockTimestamp } from '../lib/media'
import { isMuted, onMuteChange, setMuted, unlockAudio } from '../lib/audio'
import { startMusic, stopMusic } from '../lib/music'
import Backdrop from './Backdrop'
import Gate from './Gate'
import LockScreen from './LockScreen'
import CakeStage from './CakeStage'
import UnboxStage from './UnboxStage'
import ExternalPlayer from './ExternalPlayer'

const INTERNAL = new Set(['lofi', 'acoustic', 'musicbox', 'piano'])

// Alıcı deneyimi: gate → (zaman kilidi) → (pasta) → hediye kutusu → masa
export default function Experience({ gift, testMode = false, onExit }) {
  const safeGift = useMemo(() => normalizeGift(gift), [gift])
  const theme = getTheme(safeGift.theme)
  const lockTs = lockTimestamp(safeGift.lock)
  const [stage, setStage] = useState('gate')
  const [muted, setMutedState] = useState(false)
  const [skipLock, setSkipLock] = useState(false)

  const preset = safeGift.music?.preset
  const link = safeGift.music?.link
  const usesLink = preset === 'link' && !!link
  const hasMusic = INTERNAL.has(preset) || usesLink

  useEffect(() => onMuteChange(setMutedState), [])
  useEffect(
    () => () => {
      try {
        stopMusic(true)
        setMuted(false)
      } catch {
        /* yoksay */
      }
    },
    [],
  )

  const afterLock = safeGift.birthday?.on ? 'cake' : 'box'

  const start = async (withSound) => {
    try {
      await unlockAudio()
    } catch {
      /* yoksay */
    }
    try {
      setMuted(!withSound)
      if (INTERNAL.has(preset)) startMusic(preset)
    } catch {
      /* yoksay */
    }
    const locked = lockTs && Date.now() < lockTs && !skipLock
    setStage(locked ? 'locked' : afterLock)
  }

  const toBox = useCallback(() => setStage('box'), [])
  const afterUnlock = useCallback(() => setStage(afterLock), [afterLock])
  const skip = useCallback(() => setStage(afterLock), [afterLock])
  const started = stage !== 'gate'

  return (
    <div className="exp" style={themeVars(theme)} data-dark={theme.dark ? '1' : '0'}>
      <Backdrop />

      <AnimatePresence mode="wait">
        {stage === 'gate' && <Gate key="gate" gift={safeGift} hasMusic={hasMusic} onStart={start} />}
        {stage === 'locked' && (
          <LockScreen
            key="locked"
            target={lockTs}
            to={safeGift.letter?.to}
            testMode={testMode}
            onSkip={() => (setSkipLock(true), skip())}
            onUnlocked={afterUnlock}
          />
        )}
        {stage === 'cake' && <CakeStage key="cake" gift={safeGift} theme={theme} testMode={testMode} onDone={toBox} />}
        {stage === 'box' && <UnboxStage key="box" gift={safeGift} theme={theme} />}
      </AnimatePresence>

      {started && usesLink && <ExternalPlayer link={link} muted={muted} />}

      {started && hasMusic && (
        <motion.button
          className="sound-toggle glass"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setMuted(!isMuted())}
          aria-label={muted ? 'Sesi aç' : 'Sesi kapat'}
          title={muted ? 'Sesi aç' : 'Sesi kapat'}
        >
          {muted ? '🔇' : '🔊'}
          {!muted && (
            <span className="eq" aria-hidden="true">
              <i /><i /><i />
            </span>
          )}
        </motion.button>
      )}

      {testMode && (
        <button className="exit-test glass" onClick={onExit}>
          ✕ Testi kapat
        </button>
      )}
    </div>
  )
}
