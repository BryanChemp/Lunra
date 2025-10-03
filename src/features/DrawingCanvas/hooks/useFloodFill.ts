export function useFloodFill() {
  const getPixelColor = (imageData: ImageData, x: number, y: number) => {
    const index = (y * imageData.width + x) * 4
    const d = imageData.data
    return [d[index], d[index + 1], d[index + 2], d[index + 3]]
  }

  const floodFillScanline = (
    imageData: ImageData,
    x: number,
    y: number,
    targetColor: number[],
    fillColor: number[]
  ) => {
    const width = imageData.width
    const height = imageData.height
    const data = imageData.data

    const matchColor = (px: number, py: number) => {
      const idx = (py * width + px) * 4
      return (
        data[idx] === targetColor[0] &&
        data[idx + 1] === targetColor[1] &&
        data[idx + 2] === targetColor[2] &&
        data[idx + 3] === targetColor[3]
      )
    }

    const setColor = (px: number, py: number) => {
      const idx = (py * width + px) * 4
      data[idx] = fillColor[0]
      data[idx + 1] = fillColor[1]
      data[idx + 2] = fillColor[2]
      data[idx + 3] = fillColor[3]
    }

    const stack: [number, number][] = [[x, y]]

    while (stack.length) {
      const [px, py] = stack.pop()!
      if (!matchColor(px, py)) continue

      let left = px
      let right = px

      while (left > 0 && matchColor(left - 1, py)) left--
      while (right < width - 1 && matchColor(right + 1, py)) right++

      for (let i = left; i <= right; i++) {
        setColor(i, py)
        if (py > 0 && matchColor(i, py - 1)) stack.push([i, py - 1])
        if (py < height - 1 && matchColor(i, py + 1)) stack.push([i, py + 1])
      }
    }
  }

  return { getPixelColor, floodFillScanline }
}