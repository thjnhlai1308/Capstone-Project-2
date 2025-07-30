import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ShoeCard from './ShoeCard'
import './style.css'

const Browse = ({ user, getHeaders, favorites, setFavorites }) => {
    const [shoes, setShoes] = useState([])
    const [filteredShoes, setFilteredShoes] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchShoes = async () => {
            try {
                const {data} = await axios.get('/api/shoes')
                setShoes(data)
                setFilteredShoes(data)
            } catch (error) {
                console.error('Failed to fetch shoes:', error)
            }
        }
        fetchShoes()
    }, [])
    
    useEffect(() => {
        const lowerSearch = searchTerm.toLowerCase()
        const results = shoes.filter(shoe =>
            shoe.name.toLowerCase().includes(lowerSearch) ||
            shoe.brand.toLowerCase().includes(lowerSearch) ||
            shoe.model?.toLowerCase().includes(lowerSearch) ||
            shoe.color?.toLowerCase().includes(lowerSearch)
        )
        setFilteredShoes(results)
    }, [searchTerm, shoes])

    return (
        <div className='browse-page'>
            <h1>👟 Browse All Shoes</h1>
            <input type="text" placeholder="Search shoes by name, brand, model, color..." className="search-bar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <div className="shoe-grid">
                {filteredShoes.map((shoe) => (
                    <ShoeCard
                        key={shoe.id}
                        shoe={shoe}
                        getHeaders={getHeaders}
                        user={user}
                        favorites={favorites}
                        setFavorites={setFavorites}
                    />
                ))}
            </div>
        </div>
    )
}

export default Browse
