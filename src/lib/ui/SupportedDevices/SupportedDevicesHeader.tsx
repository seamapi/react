import { TableCell } from '../Table/TableCell.js'
import { TableHeader } from '../Table/TableHeader.js'
import { TableRow } from '../Table/TableRow.js'

export default () => (
  <TableHeader>
    <TableRow>
      <TableCell>{/* Device Image */}</TableCell>
      <TableCell>Model Name</TableCell>
      <TableCell>Manufacturer Model ID</TableCell>
      <TableCell>Connection Type</TableCell>
      <TableCell>Supported?</TableCell>
    </TableRow>
  </TableHeader>
)
