import React from 'react'
import Modal from './Modal'
import Button from './Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCircleCheck,
  faTriangleExclamation,
  faShieldHalved,
  faCircleExclamation,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons'

export default function AlertModal({
  isOpen,
  onClose,
  onConfirm,
  type = 'warning', // 'warning' | 'success' | 'permission' | 'danger'
  title = '',
  description = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
}) {
  const configs = {
    success: {
      icon: faCircleCheck,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-200',
      confirmVariant: 'primary',
      defaultTitle: 'Success!',
    },
    warning: {
      icon: faTriangleExclamation,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 border-amber-200',
      confirmVariant: 'secondary',
      defaultTitle: 'Warning',
    },
    permission: {
      icon: faShieldHalved,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50 border-indigo-200',
      confirmVariant: 'primary',
      defaultTitle: 'Permission Required',
    },
    danger: {
      icon: faTrashCan,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50 border-rose-200',
      confirmVariant: 'danger',
      defaultTitle: 'Are you sure?',
    },
  }

  const current = configs[type] || configs.warning

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={false}>
      <div className="text-center space-y-4 pt-2">
        {/* Icon Circle */}
        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl border ${current.iconBg} ${current.iconColor}`}>
          <FontAwesomeIcon icon={current.icon} />
        </div>

        {/* Text Content */}
        <div className="space-y-1.5 px-2">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {title || current.defaultTitle}
          </h3>
          {description && (
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
          {cancelText && (
            <Button
              variant="cancel"
              size="md"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              {cancelText}
            </Button>
          )}
          <Button
            variant={current.confirmVariant}
            size="md"
            loading={loading}
            onClick={onConfirm || onClose}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
