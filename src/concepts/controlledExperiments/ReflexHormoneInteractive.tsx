import { useState } from 'react'
import type { Lang } from '../../kit/i18n'
import { SliderField } from '../../kit/SliderField'
import { NotebookPipeline } from '../../notebook/NotebookSpread'
import { calculateReflexAndHomeostasis } from './models'

interface Props {
  lang: Lang
}

export function ReflexHormoneInteractive({ lang }: Props) {
  const [routingMode, setRoutingMode] = useState<'spinal-reflex-arc' | 'conscious-brain-detour'>(
    'spinal-reflex-arc'
  )
  const [armLengthM, setArmLengthM] = useState(0.8)
  const [bloodGlucose, setBloodGlucose] = useState(160)

  const res = calculateReflexAndHomeostasis(routingMode, armLengthM, bloodGlucose)

  const pipelineSteps = [
    {
      kicker: lang === 'hi' ? '1. प्रतिवर्ती चाप समय' : '1. Spinal Reflex Arc',
      math: `t_reflex = ${res.spinalReflexLatencyMs} ms (Spinal Cord)`,
    },
    {
      kicker: lang === 'hi' ? '2. मस्तिष्क सोचने का समय' : '2. Conscious Brain Detour',
      math: `t_brain = ${res.brainDetourLatencyMs} ms (Saves ${res.timeSavedByReflexMs} ms)`,
    },
    {
      kicker: lang === 'hi' ? '3. रक्त शर्करा स्तर' : '3. Blood Glucose Level',
      math: `${res.bloodGlucoseMgDl} mg/dL (Setpoint: 70–110)`,
    },
    {
      kicker: lang === 'hi' ? '4. अग्नाशय पुनर्भरण हार्मोन' : '4. Pancreas Feedback',
      math: res.activePancreaticHormone,
    },
  ]

  return (
    <div className="nb-optics-bench-wrap">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
        <button
          type="button"
          className={`nb-QuickChip ${routingMode === 'spinal-reflex-arc' ? 'is-active' : ''}`}
          onClick={() => setRoutingMode('spinal-reflex-arc')}
        >
          {lang === 'hi'
            ? '1. मेरुरज्जु प्रतिवर्ती चाप (Spinal Reflex Arc · तीव्र सुरक्षा)'
            : '1. Spinal Cord Reflex Arc (Fast Direct Relay)'}
        </button>
        <button
          type="button"
          className={`nb-QuickChip ${routingMode === 'conscious-brain-detour' ? 'is-active' : ''}`}
          onClick={() => setRoutingMode('conscious-brain-detour')}
        >
          {lang === 'hi'
            ? '2. मस्तिष्क विचार मार्ग (Conscious Brain Detour · विलंबित)'
            : '2. Conscious Brain Detour (+120 ms Thinking Delay)'}
        </button>
      </div>

      <div className="nb-optics-svg-frame">
        <svg
          viewBox="0 0 760 215"
          className="nb-optics-svg"
          role="img"
          aria-label={`Reflex arc and pancreatic hormone feedback simulator: reflex latency ${res.spinalReflexLatencyMs} ms, blood glucose ${res.bloodGlucoseMgDl} mg/dL, ${res.activePancreaticHormone}`}
        >
          <defs>
            <pattern id="nb-bio6-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#e5dcc8" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="760" height="215" fill="#fcf8ef" />
          <rect x="0" y="0" width="760" height="215" fill="url(#nb-bio6-grid)" />

          {/* Left Panel: Reflex Arc Loop (NCERT Fig 6.2) */}
          <rect x="16" y="16" width="356" height="182" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.6" />
          <text x="194" y="34" textAnchor="middle" fontSize="10" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
            1. REFLEX ARC LOOP (NCERT Fig 6.2 · L={res.armPathLengthM}m)
          </text>

          {/* Receptor (Skin / Hot Pan) */}
          <rect x="26" y="64" width="94" height="32" rx="5" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.8" />
          <text x="73" y="84" textAnchor="middle" fontSize="8.2" fontWeight="900" fill="#991b1b" fontFamily="ui-monospace, monospace">
            1. Receptor (Skin)
          </text>

          {/* Effector (Arm Muscle) */}
          <rect x="26" y="122" width="94" height="32" rx="5" fill="#ecfdf5" stroke="#16a34a" strokeWidth="1.8" />
          <text x="73" y="142" textAnchor="middle" fontSize="8.2" fontWeight="900" fill="#065f46" fontFamily="ui-monospace, monospace">
            5. Effector Muscle
          </text>

          {/* Spinal Cord Relay Neuron */}
          <rect x="166" y="92" width="92" height="36" rx="6" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
          <text x="212" y="114" textAnchor="middle" fontSize="9" fontWeight="900" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
            3. Spinal Relay
          </text>

          {/* Brain Box */}
          <rect
            x="274"
            y="48"
            width="84"
            height="34"
            rx="6"
            fill={routingMode === 'conscious-brain-detour' ? '#fef3c7' : '#f8fafc'}
            stroke={routingMode === 'conscious-brain-detour' ? '#d97706' : '#cbd5e1'}
            strokeWidth="1.8"
          />
          <text x="316" y="69" textAnchor="middle" fontSize="9" fontWeight="900" fill="#92400e" fontFamily="ui-monospace, monospace">
            Brain (+120ms)
          </text>

          {/* Sensory & Motor Neuron Arrows */}
          <line x1="118" y1="80" x2="166" y2="102" stroke="#dc2626" strokeWidth="2.4" />
          <text x="145" y="76" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#991b1b" fontFamily="ui-monospace, monospace">
            2. Sensory →
          </text>
          <line x1="166" y1="118" x2="118" y2="138" stroke="#16a34a" strokeWidth="2.4" />
          <text x="145" y="146" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#065f46" fontFamily="ui-monospace, monospace">
            ← 4. Motor
          </text>

          {/* Spinal to Brain message arrow */}
          <line
            x1="258"
            y1="104"
            x2="274"
            y2="72"
            stroke="#d97706"
            strokeWidth="1.8"
            strokeDasharray="4 2"
          />

          <rect x="28" y="162" width="330" height="26" rx="5" fill="#eff6ff" stroke="#93c5fd" />
          <text x="193" y="179" textAnchor="middle" fontSize="9" fontWeight="900" fill="#1e3a8a" fontFamily="ui-monospace, monospace">
            {`Reflex: ${res.spinalReflexLatencyMs} ms vs Brain Detour: ${res.brainDetourLatencyMs} ms (Saves ${res.timeSavedByReflexMs} ms!)`}
          </text>

          {/* Right Panel: Pancreatic Negative-Feedback Loop (NCERT Sec 6.3) */}
          <g transform="translate(384, 16)">
            <rect x="0" y="0" width="358" height="182" rx="8" fill="#ffffff" stroke="#b8a585" strokeWidth="1.8" />
            <text x="179" y="22" textAnchor="middle" fontSize="10" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
              2. HORMONE NEGATIVE FEEDBACK (NCERT Ch 6.3)
            </text>

            <rect x="14" y="34" width="330" height="40" rx="5" fill="#f8fafc" stroke="#cbd5e1" />
            <text x="22" y="50" fontSize="9.5" fontWeight="800" fill="#334155" fontFamily="ui-monospace, monospace">
              BLOOD GLUCOSE LEVEL (Normal Setpoint: 70–110 mg/dL):
            </text>
            <text x="22" y="66" fontSize="10.5" fontWeight="900" fill="#0f172a" fontFamily="ui-monospace, monospace">
              Current Glucose = {res.bloodGlucoseMgDl} mg/dL ({res.glucoseStatus.toUpperCase()})
            </text>

            <rect
              x="14"
              y="82"
              width="330"
              height="44"
              rx="5"
              fill={
                res.glucoseStatus === 'normal-homeostasis'
                  ? '#ecfdf5'
                  : res.glucoseStatus === 'hyperglycemia-high'
                    ? '#fef2f2'
                    : '#fef3c7'
              }
              stroke={
                res.glucoseStatus === 'normal-homeostasis'
                  ? '#6ee7b7'
                  : res.glucoseStatus === 'hyperglycemia-high'
                    ? '#fca5a5'
                    : '#fcd34d'
              }
            />
            <text x="22" y="100" fontSize="10" fontWeight="900" fill="#1e293b" fontFamily="ui-monospace, monospace">
              PANCREAS RESPONSE: {res.activePancreaticHormone}
            </text>
            <text x="22" y="117" fontSize="8.5" fontWeight="800" fill="#334155" fontFamily="ui-monospace, monospace">
              {res.feedbackMechanismText}
            </text>

            <rect x="14" y="134" width="330" height="36" rx="5" fill="#fef3c7" stroke="#fcd34d" />
            <text x="179" y="156" textAnchor="middle" fontSize="9" fontWeight="900" fill="#92400e" fontFamily="ui-monospace, monospace">
              Negative Feedback: Output opposes deviation from setpoint!
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.85rem' }}>
        <SliderField
          id="rh-arm-slider"
          label={lang === 'hi' ? 'भुजा तंत्रिका पथ की लंबाई (L)' : 'Arm Nerve Path Length (L)'}
          value={armLengthM}
          min={0.5}
          max={1.2}
          step={0.1}
          unit=" m"
          lang={lang}
          onChange={setArmLengthM}
        />
        <SliderField
          id="rh-glucose-slider"
          label={lang === 'hi' ? 'रक्त शर्करा स्तर (Blood Glucose)' : 'Blood Glucose Concentration'}
          value={bloodGlucose}
          min={50}
          max={220}
          step={10}
          unit=" mg/dL"
          lang={lang}
          onChange={setBloodGlucose}
        />
      </div>

      <NotebookPipeline steps={pipelineSteps} ariaLabel="Spinal reflex arc latency and pancreatic negative feedback pipeline" />
    </div>
  )
}
