/** The adjacent text carries the meaning of these contextual illustrations. */
export function RequirementIcon({ message }: { message: string }): JSX.Element {
  return (
    <svg
      className='seam-supported-devices-requirement-icon'
      aria-hidden
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      {/\b(?:legal|eula|waiver|end[- ]user licen[cs]e agreement)\b/i.test(
        message
      ) ? (
        <>
          <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z' />
          <path d='M14 2v6h6M8 15l2 2 5-5' />
        </>
      ) : /subscription|licen[sc]e|paying|paid|fees?/i.test(message) ? (
        <>
          <rect x='2' y='4' width='20' height='16' rx='3' />
          <path d='M2 9h20M6 15h4m4 0h4' />
        </>
      ) : /keypad/i.test(message) ? (
        <>
          <rect x='5' y='2' width='14' height='20' rx='3' />
          <path d='M9 6h6M9 10h.01M12 10h.01M15 10h.01M9 14h.01M12 14h.01M15 14h.01M12 18h.01' />
        </>
      ) : /bridge|hub/i.test(message) ? (
        <>
          <rect x='3' y='12' width='18' height='8' rx='2' />
          <path d='M7 12V8m10 4V8M7 16h.01M11 16h.01M9 5a5 5 0 0 1 6 0M6 2a10 10 0 0 1 12 0' />
        </>
      ) : (
        <>
          <circle cx='12' cy='12' r='9' />
          <path d='M12 11v6m0-10h.01' />
        </>
      )}
    </svg>
  )
}
