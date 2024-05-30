'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from './styles.module.css'

interface ImageViewerProps {
  src: string
  alt: string
  className: string
  width: number
  height: number
  expandable?: boolean
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  src,
  alt,
  className,
  width,
  height,
  expandable = true,
}) => {
  const [isZoomed, setIsZoomed] = useState(false)

  const handleClick = () => {
    if (expandable) {
      console.log('inside expandable')
      setIsZoomed(!isZoomed)
    }
  }

  const handleScroll = () => {
    if (isZoomed) {
      setIsZoomed(false)
    }
  }

  useEffect(() => {
    if (expandable) {
      window.addEventListener('scroll', handleScroll)
      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [isZoomed, expandable])

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer ${isZoomed ? styles.zoomedImageContainer : ''}`}
    >
      <Image
        src={src}
        alt={alt}
        className={`${className} ${isZoomed ? styles.zoomedImage : ''}`}
        width={width}
        height={height}
      />
    </div>
  )
}
