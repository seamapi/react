export function SupportedDeviceHeader(): JSX.Element {
  return (
    <thead>
      <tr>
        <th />
        <th>{t.category}</th>
        <th>{t.modelName}</th>
        <th>{t.manufacturerModelId}</th>
        <th>{t.connectionType}</th>
        <th>{t.status}</th>
      </tr>
    </thead>
  )
}

const t = {
  category: 'Category',
  modelName: 'Model Name',
  manufacturerModelId: 'Manufacturer Model ID',
  connectionType: 'Connection Type',
  status: 'Status',
}
