import React, { useState, useEffect } from 'react'
import { useToast } from '../../context/ToastContext'
import AlertModal from '../ui/AlertModal'
import HeroBannerListView from './HeroBannerListView'
import AddHeroBannerView from './AddHeroBannerView'
import EditHeroBannerView from './EditHeroBannerView'
import HeroBannerDetailsView from './HeroBannerDetailsView'
import {
  getAdminHeroBannersApi,
  createAdminHeroBannerApi,
  deleteAdminHeroBannerApi
} from '../../utils/adminApi'

const HERO_BANNERS_STORAGE_KEY = 'bazario_hero_banners'

export default function HeroBannerManageView() {
  const toast = useToast()

  // Storage State
  const [banners, setBanners] = useState([])

  const fetchBanners = async () => {
    try {
      const res = await getAdminHeroBannersApi()
      const list = res.banners || res.data || []
      const formatted = (Array.isArray(list) ? list : []).map((b, idx) => ({
        id: b._id || b.id || idx + 1,
        _id: b._id,
        title: b.title || b.altText || `Hero Banner #${idx + 1}`,
        redirectUrl: b.redirectUrl || '/',
        webImage: b.webImage || b.image || '/supermart-bg.jpg',
        mobileImage: b.mobileImage || b.webImage || '/supermart-bg.jpg',
        sortingOrder: b.sortingOrder || idx + 1,
        status: b.status || (b.active ? 'Active' : 'Active')
      }))
      setBanners(formatted)
    } catch (err) {
      console.warn('Failed to fetch hero banners:', err)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  // View state: 'list' | 'add' | 'edit' | 'view'
  const [viewMode, setViewMode] = useState('list')
  const [selectedBanner, setSelectedBanner] = useState(null)

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, banner: null })

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
  const handleSaveNewBanner = async (newBanner) => {
    try {
      await createAdminHeroBannerApi(newBanner)
      toast.success('Hero Banner Created', `"${newBanner.title}" published to homepage carousel!`)
      fetchBanners()
      handleGoToList()
    } catch (err) {
      const updatedList = [newBanner, ...banners]
      setBanners(updatedList)
      toast.success('Hero Banner Created', `"${newBanner.title}" published to homepage carousel!`)
      handleGoToList()
    }
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
  const handleDeleteBanner = async (bannerId, bannerTitle) => {
    try {
      await deleteAdminHeroBannerApi(bannerId)
      toast.success('Hero Banner Removed', `"${bannerTitle}" removed from carousel.`)
      fetchBanners()
    } catch (err) {
      setBanners((prev) => prev.filter((b) => b.id !== bannerId))
      toast.success('Hero Banner Removed', `"${bannerTitle}" removed from carousel.`)
    }
    setDeleteModal({ isOpen: false, banner: null })
    if (selectedBanner && selectedBanner.id === bannerId) {
      handleGoToList()
    }
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
