export const metadata = {
  title: '말하기 수업 AI',
  description: '초등 말하기 수업용 AI 대화 도구',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
