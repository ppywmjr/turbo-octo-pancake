import LinkText from '@/app/components/atoms/text/LinkText'

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--color-surface)] py-4">
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-4">
          <LinkText href="/policies/cookie-policy">Cookie policy</LinkText>
          <LinkText href="/policies/terms-of-use">Terms of use</LinkText>
        </div>
      </div>
    </footer>
  )
}