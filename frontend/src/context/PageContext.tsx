import React, { createContext, useContext, useState, ReactNode } from 'react'

interface PageContextType {
  page: Page
  setPage: (newPage: Page) => void
}

export type Page = 'groups' | 'attendance' | 'latecoming' | 'shuffling' | 'locked'

const PageContext = createContext<PageContextType | undefined>(undefined)

export const PageProvider = ({ children }: { children: ReactNode }) => {
  const [page, setPage] = useState<Page>('groups')

  return <PageContext.Provider value={{ page, setPage }}>{children}</PageContext.Provider>
}

export const usePageContext = () => {
  const ctx = useContext(PageContext)
  if (!ctx) throw new Error('useMyAppContext must be used within MyAppProvider')
  return ctx
}
