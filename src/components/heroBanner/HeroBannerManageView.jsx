import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import AlertModal from '../ui/AlertModal'
import HeroBannerListView from './HeroBannerListView'
import AddHeroBannerView from './AddHeroBannerView'
import EditHeroBannerView from './EditHeroBannerView'
import HeroBannerDetailsView from './HeroBannerDetailsView'

const HERO_BANNERS_STORAGE_KEY = 'bazario_hero_banners'

const INITIAL_HERO_BANNERS = [
  {
    id: 1,
    title: 'Super Weekend Fresh Produce Sale - Flat 40% Off',
    webImage: '/supermart-bg.jpg',
    mobileImage: '/supermart-bg.jpg',
    sortingOrder: 1,
    status: 'Active'
  },
  {
    id: 2,
    title: 'Mega Daily Essentials & Dairy Morning Rush',
    webImage: '',
    mobileImage: '',
    sortingOrder: 2,
    status: 'Active'
  },
  {
    id: 3,
    title: 'Festival Sweets, Dry Fruits & Gourmet Gifting Hampers',
    webImage: '',
    mobileImage: '',
    sortingOrder: 3,
    status: 'Inactive'
  }
]

export default function HeroBannerManageView() {
  const toast = useToast()

  // Storage State
  const [banners, setBanners] = useState(() => {
    try {
      const saved = localStorage.getItem(HERO_BANNERS_STORAGE_KEY)
      return saved ? JSON.parse(saved) : INITIAL_HERO_BANNERS
    } catch {
      return INITIAL_HERO_BANNERS
    }
  })

  // View state: 'list' | 'add' | 'edit' | 'view'
  const [viewMode, setViewMode] = useState('list')
  const [selectedBanner, setSelectedBanner] = useState(null)

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, banner: null })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HERO_BANNERS_STORAGE_KEY, JSON.stringify(banners))
    } catch (e) {
      console.error('Failed to persist hero banners', e)
    }
  }, [banners])

  // Hash Route Parser & Listener
  useEffect(() => {
    const parseRoute = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '').trim()
      if (
        hash.startsWith('web-hero-banner') ||
        hash.startsWith('hero-banner-manage') ||
        hash.startsWith('hero-banners') ||
        hash.startsWith('hero-banner')
      ) {
        const parts = hash.split('/')
        const action = parts[1] // 'add' | 'edit' | 'view'
        const id = parts[2] ? parts[2] : null

        if (action === 'add') {
          setSelectedBanner(null)
          setViewMode('add')
        } else if (action === 'edit' && id) {
          const found = banners.find((b) => String(b.id) === String(id))
          if (found) {
            setSelectedBanner(found)
            setViewMode('edit')
          } else {
            setViewMode('list')
          }
        } else if (action === 'view' && id) {
          const found = banners.find((b) => String(b.id) === String(id))
          if (found) {
            setSelectedBanner(found)
            setViewMode('view')
          } else {
            setViewMode('list')
          }
        } else if (!action) {
          setViewMode('list')
        }
      }
    }

    parseRoute()
    window.addEventListener('hashchange', parseRoute)
    return () => window.removeEventListener('hashchange', parseRoute)
  }, [banners])

  // Navigation handlers with route update
  const handleGoToList = () => {
    window.location.hash = '#/hero-banner-manage'
    setViewMode('list')
    setSelectedBanner(null)
  }

  const handleOpenAdd = () => {
    window.location.hash = '#/hero-banner-manage/add'
    setSelectedBanner(null)
    setViewMode('add')
  }

  const handleOpenEdit = (banner) => {
    window.location.hash = `#/hero-banner-manage/edit/${banner.id}`
    setSelectedBanner(banner)
    setViewMode('edit')
  }

  const handleOpenView = (banner) => {
    window.location.hash = `#/hero-banner-manage/view/${banner.id}`
    setSelectedBanner(banner)
    setViewMode('view')
  }

  // Save new banner
  const handleSaveNewBanner = (newBanner) => {
    const updatedList = [newBanner, ...banners]
    setBanners(updatedList)
    toast.success('Hero Banner Created', `"${newBanner.title}" published to homepage carousel!`)
    handleGoToList()
  }

  // Save edited banner
  const handleSaveEditedBanner = (updatedBanner) => {
    const updatedList = banners.map((b) => (b.id === updatedBanner.id ? updatedBanner : b))
    setBanners(updatedList)
    setSelectedBanner(updatedBanner)
    toast.success('Hero Banner Updated', `"${updatedBanner.title}" updated successfully!`)
    handleGoToList()
  }

  // Delete banner
  const handleDeleteBanner = (bannerId, bannerTitle) => {
    setBanners((prev) => prev.filter((b) => b.id !== bannerId))
    setDeleteModal({ isOpen: false, banner: null })
    if (selectedBanner && selectedBanner.id === bannerId) {
      handleGoToList()
    }
    toast.success('Hero Banner Removed', `"${bannerTitle}" removed from carousel.`)
  }

  // Toggle status
  const handleToggleStatus = (banner) => {
    const newStatus = banner.status === 'Active' ? 'Inactive' : 'Active'
    const updatedList = banners.map((b) => (b.id === banner.id ? { ...b, status: newStatus } : b))
    setBanners(updatedList)
    if (selectedBanner && selectedBanner.id === banner.id) {
      setSelectedBanner({ ...selectedBanner, status: newStatus })
    }
    toast.info('Status Changed', `"${banner.title}" is now ${newStatus}.`)
  }

  return (
    <div className="space-y-6">
      {/* 1. LIST VIEW */}
      {viewMode === 'list' && (
        <HeroBannerListView
          banners={banners}
          onOpenAdd={handleOpenAdd}
          onOpenEdit={handleOpenEdit}
          onOpenView={handleOpenView}
          onOpenDelete={(banner) => setDeleteModal({ isOpen: true, banner })}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* 2. ADD VIEW */}
      {viewMode === 'add' && (
        <AddHeroBannerView
          onBack={handleGoToList}
          onSave={handleSaveNewBanner}
          bannersCount={banners.length}
        />
      )}

      {/* 3. EDIT VIEW */}
      {viewMode === 'edit' && selectedBanner && (
        <EditHeroBannerView
          banner={selectedBanner}
          onBack={handleGoToList}
          onSave={handleSaveEditedBanner}
        />
      )}

      {/* 4. DETAILS VIEW */}
      {viewMode === 'view' && selectedBanner && (
        <HeroBannerDetailsView
          banner={selectedBanner}
          onBack={handleGoToList}
          onEdit={handleOpenEdit}
        />
      )}

      {/* Reusable AlertModal for Delete Confirmation */}
      <AlertModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, banner: null })}
        onConfirm={() =>
          handleDeleteBanner(deleteModal.banner?.id, deleteModal.banner?.title)
        }
        title="Delete Hero Banner?"
        message={`Are you sure you want to delete "${deleteModal.banner?.title}"? This banner will be removed from the homepage carousel.`}
        confirmText="Delete Banner"
        cancelText="Keep Banner"
        type="danger"
      />
    </div>
  )
}
