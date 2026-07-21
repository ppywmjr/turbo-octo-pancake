import LinkText from '@/app/components/atoms/text/LinkText'

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-surface)] py-4">
      <div className="flex items-center justify-center">
        <LinkText href="/cookie-policy">Cookie Policy</LinkText>
      </div>
    </footer>
  )
}