import React from 'react'
import { Link } from 'react-router-dom'
import CategoryItem from '../components/CategoryItem'

const categories = [
  { href: "/Kids", name: "Kids", imageUrl:"/kids books.jpg" },
  { href:"/teens", name:"Teens", imageUrl:"/romance.jpg" },
  { href:"/adults", name:"Adults", imageUrl:"/spirit books.jpg" },
  { href:"/Christian" , name: "Christian", imageUrl:"/christain.jpg" }
]

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-100 mb-8 text-center">
        Discover our categories
      </h1>
      <p className="text-center text-gray-400 mb-12">
        Explore a variety of book categories to find your next great read.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryItem
            category={category}
            key={category.name}
          />
        ))}
      </div>
    </div>
  )
}

export default HomePage