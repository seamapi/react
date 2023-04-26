export default function SvgImage(props: { src: string; alt?: string }) {
  return (
    <img
      src={`data:image/svg+xml;utf8,${encodeURIComponent(props.src)}`}
      alt={props.alt}
    />
  )
}
