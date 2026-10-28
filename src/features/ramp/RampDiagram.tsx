import type { RampModelResult } from './rampModel'
import { formatDisplayNumber } from './rampInputValidation'

export interface RampDiagramProps {
  result: RampModelResult
}

/**
 * Original 2D SVG visualisation of the ideal frictionless ramp.
 * Uses identical geometric scale on X and Y axes so the inclination angle is truthful.
 */
export function RampDiagram({ result }: RampDiagramProps) {
  const {
    massKg,
    heightM,
    rampLengthM,
    horizontalRunM,
    rampAngleRadians,
    rampAngleDegrees,
    pullingForceN,
  } = result

  const isVerticalLimit = horizontalRunM < 1e-4

  // Equal pixels-per-meter scale on both axes so the angle is geometrically truthful
  const PX_PER_METER = 100
  const runPx = horizontalRunM * PX_PER_METER
  const heightPx = heightM * PX_PER_METER
  const rampLenPx = rampLengthM * PX_PER_METER

  const padLeft = 80
  const padRight = 190
  const padTop = 95
  const padBottom = 75

  const svgWidth = Math.max(480, Math.ceil(runPx + padLeft + padRight))
  const svgHeight = Math.max(260, Math.ceil(heightPx + padTop + padBottom))

  const originX = isVerticalLimit ? Math.round(svgWidth * 0.42) : padLeft
  const groundY = svgHeight - padBottom

  const topX = originX + runPx
  const topY = groundY - heightPx

  // Unit vectors: u = uphill along ramp, n = outward normal above the ramp surface
  const ux = Math.cos(rampAngleRadians)
  const uy = -Math.sin(rampAngleRadians)
  const nx = -Math.sin(rampAngleRadians)
  const ny = -Math.cos(rampAngleRadians)

  // Block dimensions in SVG pixels
  const blockWidth = 44
  const blockHeight = 28

  // Place block 38% of the way up the slope, offset by blockHeight / 2 along the outward normal
  // so the block rests cleanly on top of the surface rather than embedded in it.
  const distAlongPx = rampLenPx * 0.38
  const surfacePointX = originX + distAlongPx * ux
  const surfacePointY = groundY + distAlongPx * uy

  const blockCenterX = surfacePointX + (blockHeight / 2) * nx
  const blockCenterY = surfacePointY + (blockHeight / 2) * ny

  // Pulling force arrow starts from the uphill face of the block and points parallel to the slope
  const arrowStartX = blockCenterX + (blockWidth / 2) * ux
  const arrowStartY = blockCenterY + (blockWidth / 2) * uy
  const arrowLengthPx = Math.min(78, Math.max(48, rampLenPx * 0.28))
  const arrowEndX = arrowStartX + arrowLengthPx * ux
  const arrowEndY = arrowStartY + arrowLengthPx * uy

  // Arrowhead geometry (explicitly drawn in world coordinates for reliable rendering)
  const headLen = 10
  const headHalfWidth = 5
  const arrowBaseX = arrowEndX - headLen * ux
  const arrowBaseY = arrowEndY - headLen * uy
  const arrowWing1X = arrowBaseX + headHalfWidth * nx
  const arrowWing1Y = arrowBaseY + headHalfWidth * ny
  const arrowWing2X = arrowBaseX - headHalfWidth * nx
  const arrowWing2Y = arrowBaseY - headHalfWidth * ny

  // Pulling force label positioned above the arrow along the outward normal
  const forceLabelX = (arrowStartX + arrowEndX) / 2 + 22 * nx
  const forceLabelY = (arrowStartY + arrowEndY) / 2 + 22 * ny

  // Slope length label midpoint (offset slightly above or below depending on steepness)
  const slopeMidX = (originX + topX) / 2
  const slopeMidY = (groundY + topY) / 2
  const lengthLabelX = isVerticalLimit ? originX - 16 : slopeMidX + 20 * nx
  const lengthLabelY = isVerticalLimit ? slopeMidY - 14 : slopeMidY + 20 * ny

  // Angle arc radius
  const arcRadius = Math.min(46, Math.max(26, rampLenPx * 0.22))
  const arcEndX = originX + arcRadius * Math.cos(rampAngleRadians)
  const arcEndY = groundY - arcRadius * Math.sin(rampAngleRadians)
  const halfAngleRad = rampAngleRadians / 2
  const angleLabelRadius = arcRadius + 24
  const angleLabelX = originX + angleLabelRadius * Math.cos(halfAngleRad)
  const angleLabelY = groundY - angleLabelRadius * Math.sin(halfAngleRad)

  // Height dimension line on the right of the ramp
  const heightDimX = topX + 36
  const heightMidY = (groundY + topY) / 2

  const formattedAngle = formatDisplayNumber(rampAngleDegrees, 1)
  const formattedForce = formatDisplayNumber(pullingForceN, 2)
  const formattedHeight = formatDisplayNumber(heightM, 2)
  const formattedLength = formatDisplayNumber(rampLengthM, 2)
  const formattedRun = formatDisplayNumber(horizontalRunM, 2)

  return (
    <div className="ramp-diagram-wrapper">
      <svg
        className="ramp-svg"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        role="img"
        aria-labelledby="ramp-svg-title ramp-svg-desc"
      >
        <title id="ramp-svg-title">
          Ideal frictionless ramp diagram ({formattedLength} m length, {formattedHeight} m height,{' '}
          {formattedAngle}° angle)
        </title>
        <desc id="ramp-svg-desc">
          A 2D geometric diagram drawn at a 1:1 aspect ratio showing a {massKg} kg block on a{' '}
          {formattedLength} m ramp rising {formattedHeight} m vertically at a {formattedAngle}{' '}
          degree angle. An uphill arrow parallel to the slope represents the required constant-speed
          pulling force of {formattedForce} N.
        </desc>

        {/* Ground reference line */}
        <line
          x1={24}
          y1={groundY}
          x2={svgWidth - 24}
          y2={groundY}
          className="svg-ground-line"
        />
        <text x={28} y={groundY + 22} className="svg-caption-text">
          Ground level
        </text>

        {/* Ramp triangle / vertical wall */}
        {!isVerticalLimit ? (
          <polygon
            points={`${originX},${groundY} ${topX},${groundY} ${topX},${topY}`}
            className="svg-ramp-fill"
          />
        ) : null}

        {/* Ramp slope surface */}
        <line
          x1={originX}
          y1={groundY}
          x2={topX}
          y2={topY}
          className="svg-ramp-surface"
        />

        {/* Right-angle marker at base of vertical rise when horizontal run > 0 */}
        {!isVerticalLimit && runPx > 28 && heightPx > 28 ? (
          <polyline
            points={`${topX - 12},${groundY} ${topX - 12},${groundY - 12} ${topX},${groundY - 12}`}
            className="svg-right-angle"
          />
        ) : null}

        {/* Angle arc and label */}
        {!isVerticalLimit ? (
          <g className="svg-angle-group">
            <path
              d={`M ${originX + arcRadius} ${groundY} A ${arcRadius} ${arcRadius} 0 0 0 ${arcEndX} ${arcEndY}`}
              className="svg-angle-arc"
            />
            <text
              x={angleLabelX}
              y={angleLabelY}
              textAnchor="start"
              dominantBaseline="middle"
              className="svg-dimension-text svg-angle-text"
            >
              θ = {formattedAngle}°
            </text>
          </g>
        ) : (
          <text
            x={originX + 14}
            y={groundY - 16}
            textAnchor="start"
            className="svg-dimension-text svg-angle-text"
          >
            θ = 90° (vertical lift limit)
          </text>
        )}

        {/* Horizontal run label */}
        {!isVerticalLimit ? (
          <text
            x={(originX + topX) / 2}
            y={groundY + 24}
            textAnchor="middle"
            className="svg-dimension-text"
          >
            Horizontal run: {formattedRun} m
          </text>
        ) : null}

        {/* Vertical height dimension line and label */}
        <g className="svg-height-group">
          <line
            x1={topX + 6}
            y1={topY}
            x2={heightDimX + 6}
            y2={topY}
            className="svg-guide-tick"
          />
          <line
            x1={topX + 6}
            y1={groundY}
            x2={heightDimX + 6}
            y2={groundY}
            className="svg-guide-tick"
          />
          <line
            x1={heightDimX}
            y1={topY}
            x2={heightDimX}
            y2={groundY}
            className="svg-height-line"
          />
          <text
            x={heightDimX + 12}
            y={heightMidY}
            textAnchor="start"
            dominantBaseline="middle"
            className="svg-dimension-text"
          >
            Height h = {formattedHeight} m
          </text>
        </g>

        {/* Ramp length label */}
        <text
          x={lengthLabelX}
          y={lengthLabelY}
          textAnchor={isVerticalLimit ? 'end' : 'middle'}
          dominantBaseline="middle"
          className="svg-dimension-text svg-length-text"
        >
          Ramp length L = {formattedLength} m
        </text>

        {/* Block resting on top of the ramp surface */}
        <g
          transform={`translate(${blockCenterX}, ${blockCenterY}) rotate(${-rampAngleDegrees})`}
          className="svg-block-group"
        >
          <rect
            x={-blockWidth / 2}
            y={-blockHeight / 2}
            width={blockWidth}
            height={blockHeight}
            rx={4}
            className="svg-block-rect"
          />
          <text
            x={0}
            y={1}
            textAnchor="middle"
            dominantBaseline="middle"
            className="svg-block-label"
          >
            {formatDisplayNumber(massKg, 1)} kg
          </text>
        </g>

        {/* Uphill pulling force arrow parallel to the slope */}
        <g className="svg-force-group">
          <line
            x1={arrowStartX}
            y1={arrowStartY}
            x2={arrowBaseX}
            y2={arrowBaseY}
            className="svg-force-shaft"
          />
          <polygon
            points={`${arrowEndX},${arrowEndY} ${arrowWing1X},${arrowWing1Y} ${arrowWing2X},${arrowWing2Y}`}
            className="svg-force-head"
          />
          <text
            x={forceLabelX}
            y={forceLabelY}
            textAnchor={isVerticalLimit ? 'end' : 'middle'}
            dominantBaseline="middle"
            className="svg-force-label"
          >
            Pulling force: {formattedForce} N
          </text>
        </g>
      </svg>

      <p className="diagram-scale-note">
        <strong>Diagram note:</strong> Ramp rise, horizontal run, and slope angle (
        {formattedAngle}°) are drawn to an exact 1:1 geometric scale. The uphill pulling-force
        arrow direction is exact, while its length is illustrative so the label stays readable at
        all forces.
      </p>
    </div>
  )
}
