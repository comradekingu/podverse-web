export {}
// import { fireEvent, render, screen } from '@testing-library/react'
// import { noop } from '~/lib/test-helpers'
// import { Tile } from '../Tile'

// describe('Title', () => {
//   it('renders a heading', () => {
//     render(<Tile title='Some Text' onClick={noop} />)

//     const heading = screen.getByRole('heading', {
//       name: /Some Text/i
//     })

//     expect(heading).toBeInTheDocument()
//   })

//   it('calls the click handler when the heading is clicked', () => {
//     const clickHandler = jest.fn()
//     render(<Tile title='Some Text' onClick={clickHandler} />)

//     const heading = screen.getByRole('heading', {
//       name: /Some Text/i
//     })

//     fireEvent.click(heading)
//     expect(clickHandler).toHaveBeenCalled()
//   })
// })
