import React from 'react'
import style from './Searchbar.module.css'

export default function Searchbar() {
  // const router = useRouter()
  //
  // useEffect(() => {
  //   router.prefetch('/search')
  // }, [router])
  //
  // const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   e.preventDefault()
  //
  //   if (e.key === 'Enter') {
  //     const q = e.currentTarget.value
  //
  //     router.push(
  //       {
  //         pathname: `/search`,
  //         query: q ? { q } : {},
  //       },
  //       undefined,
  //       { shallow: true }
  //     )
  //   }
  // }

  return (
    <div className={style.searchContainer}>
      <input type="text"
             className={style.searchBox}
             placeholder="Search for your favorite TV show..."/>
      <input className={style.searchButton} type="image" src="/search.svg" alt="Search icon" width={24} height={24}/>
    </div>
  )
}