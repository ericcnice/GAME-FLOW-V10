"use client"

import type * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, type ButtonProps } from "@/components/ui/button"

interface ConfirmDialogProps {
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  children: React.ReactNode
  variant?: ButtonProps["variant"]
  className?: string
}

export function ConfirmDialog({
  title,
  description,
  confirmText = "Continue",
  cancelText = "Cancel",
  onConfirm,
  children,
  variant = "default",
  className,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={variant} className={className}>
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
