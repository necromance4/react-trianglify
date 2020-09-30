'use strict'

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import trianglify from 'trianglify'
import { extractProps } from './props'

class Trianglify extends Component {
  constructor () {
    super()
    this.state = { pattern: null }
  }

  componentDidMount () {
    this.generatePattern(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.generatePattern(nextProps)
  }

  generatePng (outputMethod) {
    this.setState({ pattern: outputMethod() })
  }

  generateSvg (outputMethod) {
    this.setState({ pattern: outputMethod().innerHTML })
  }

  generateCanvas (outputMethod) {
    outputMethod(this.trianglify)
  }

  outputTypes (output) {
    return {
      canvas: {
        method: 'generateCanvas',
        component: ({ canvasRef, height, width, className }) => (
          <canvas ref={canvasRef} height={height} width={width} className={className} />
        )
      },

      svg: {
        method: 'generateSvg',
        component: ({ pattern, height, width, className }) => (
          <svg dangerouslySetInnerHTML={{ __html: pattern }} height={height} width={width} className={className} />
        )
      },

      png: {
        method: 'generatePng',
        component: ({ pattern, height, width, className }) => (
          <img src={pattern} height={height} width={width} className={className} />
        )
      }
    }[output]
  }

  generatePattern ({ output, ...props }) {
    const pattern = trianglify(props)
    const outputMethod = pattern[output]

    this[this.outputTypes(output).method](outputMethod)
  }

  render () {
    const { output, width, height, className } = this.props

    return this.outputTypes(output).component({
      height,
      width,
      className,
      pattern: this.state.pattern,
      canvasRef: (node) => (this.trianglify = node)
    })
  }
}

const getProps = extractProps(PropTypes)

Trianglify.defaultProps = getProps('defaultValue')
Trianglify.propTypes = getProps('type')

export default Trianglify
