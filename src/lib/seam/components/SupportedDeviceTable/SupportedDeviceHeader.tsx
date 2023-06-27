export function SupportedDeviceHeader(): JSX.Element {
  return (
    <thead>
      <tr>
        <th />
        <th>{t.modelName}</th>
        <th>{t.manufacturerModelId}</th>
        <th>{t.status}</th>
      </tr>
    </thead>
  )
}

const t = {
  category: 'Category',
  modelName: 'Model Name',
  manufacturerModelId: 'Manufacturer Model ID',
  status: 'Status',
}
