import React from 'react'
import ProductManageView from './ProductManageView'

/**
 * ProductsView - Alias wrapper exporting the live connected ProductManageView
 * ensuring live MongoDB sync and sub-views (List, Add, Edit, Details)
 */
export default function ProductsView(props) {
  return <ProductManageView {...props} />
}
