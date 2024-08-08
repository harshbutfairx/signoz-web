'use client'

import { allGuides } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import BlogPostCard from '../../Shared/BlogPostCard'
import { filterData } from 'app/utils/common'
import SearchInput from '../../Shared/Search'
import { Frown } from 'lucide-react'
import SideBar, { GUIDES_TOPICS } from '@/components/SideBar'
import { Pagination } from '@/layouts/GridLayout'

interface HeadingProps {
  tag: string
  text: string
  className?: string
}

const Heading: React.FC<HeadingProps> = ({ tag, text, className = '' }) => {
  const Tag = tag as keyof JSX.IntrinsicElements
  return <Tag className={className}>{text}</Tag>
}

interface GuidesHeaderProps {
  title: string
  description: string
  searchPlaceholder?: string
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const GuidesHeader = ({
  title,
  description,
  searchPlaceholder,
  onSearch,
}: GuidesHeaderProps) => {
  return (
    <section className="flex max-w-[697px] flex-col leading-[143%] mb-[72px]">
      <h2 className="self-start text-center text-sm font-medium uppercase tracking-wider text-signoz_sakura-500 dark:text-signoz_sakura-400 mb-0">
        resources
      </h2>
      <h1 className="mt-3 my-0 self-start text-3xl font-semibold text-indigo-500 dark:text-indigo-200">
        {title}
      </h1>
      <p className="my-4  w-full text-lg leading-8 tracking-normal text-stone-700 dark:text-stone-300 max-md:max-w-full">
        {description}
      </p>
      <SearchInput placeholder={searchPlaceholder || ''} onSearch={onSearch} />
    </section>
  )
}

export default function TopicGuides() {
  const posts = allCoreContent(sortPosts(allGuides))
  const router = useRouter()
  const { topic } = router.query // Extract the topic from the URL
  const [searchQuery, setSearchQuery] = useState('')
  const POST_PER_PAGE = 20
  const pageNumber = 1

  const activeItem = GUIDES_TOPICS.KUBERNETES

  const filteredPosts = useMemo(() => {
    if (!topic) return []

    const filtered = posts.filter((post) =>
      post.tags?.some(
        (tag) =>
          tag.toLowerCase().replace(/\s+/g, '') === topic.toString().toLowerCase()
      )
    )

    if (searchQuery) {
      return filterData(filtered, searchQuery)
    }
    return filtered
  }, [searchQuery, posts, topic])

  const handleCategoryClick = (category) => {
    if (category === GUIDES_TOPICS.ALL) {
      router.push('/resource-center/guides')
    } else {
      router.push(`/resource-center/guides/${category}`)
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  useEffect(() => {
    if (activeItem === GUIDES_TOPICS.ALL && router.pathname !== '/resource-center/guides') {
      router.replace(`/resource-center/guides`)
    }
  }, [activeItem, router])


  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(filteredPosts.length / POST_PER_PAGE),
    pageRoute: `guides/${topic}`
  }

  return (
    <div>
      <GuidesHeader
        title="SigNoz Guides"
        description="Level up your engineering skills with great resources, tutorials, and guides on monitoring, observability, Opentelemetry, and more."
        searchPlaceholder="Search for guides..."
        onSearch={handleSearch}
      />

      <div className="relative xl:-mr-16 xl:pr-16 mt-16 flex flex-col md:flex-row gap-20">
        <SideBar onCategoryClick={handleCategoryClick} activeItem={GUIDES_TOPICS.KUBERNETES} />
        <div className="flex-1">
          {filteredPosts && filteredPosts.length <= 0 && (
            <div className="no-blogs my-8 flex items-center gap-4 font-mono font-bold">
              <Frown size={16} /> No Guides found
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
            {filteredPosts.map((post) => (
              <BlogPostCard key={post.slug} blog={post} />
            ))}
          </div>
        </div>
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        pageRoute={pagination.pageRoute}
        postsPerPage={POST_PER_PAGE}
        totalPosts={filteredPosts.length}
      />
    </div>
  )
}
