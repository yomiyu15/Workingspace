export type WorkspaceCategory = "private" | "meeting" | "hot-desk" | "event" | string

export type WorkspaceAmenity = string

export type WorkspaceTag = string

export interface WorkspaceLocation {
  name?: string
  city?: string
  address?: string
}

export interface Workspace {
  id: number
  name: string
  category: WorkspaceCategory
  description?: string
  capacity?: number
  priceHour?: number
  priceDay?: number
  priceMonth?: number
  leadTime?: string
  rating?: number
  inventoryCount?: number
  locationId?: number
  locationName?: string
  locationCity?: string
  locationAddress?: string
  amenities: WorkspaceAmenity[]
  tags: WorkspaceTag[]
  images: string[]
  isFeatured?: boolean
  isActive?: boolean
}

const parseNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && !Number.isNaN(value)) return value
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  return undefined
}

const normalizeArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item
        if (item && typeof item === "object" && "label" in item) {
          return String((item as { label: string }).label)
        }
        return null
      })
      .filter(Boolean) as string[]
  }
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : []
    } catch {
      return value.split(",").map((item) => item.trim()).filter(Boolean)
    }
  }
  return []
}

export const normalizeWorkspace = (input: any): Workspace => {
  const locationData = input?.location ?? {}
  return {
    id: Number(input?.id),
    name: input?.name ?? "Workspace",
    category: input?.category ?? "private",
    description: input?.description ?? input?.summary ?? "",
    capacity: parseNumber(input?.capacity),
    priceHour: parseNumber(input?.price_hour ?? input?.priceHour),
    priceDay: parseNumber(input?.price_day ?? input?.priceDay ?? input?.price),
    priceMonth: parseNumber(input?.price_month ?? input?.priceMonth),
    leadTime: input?.lead_time ?? input?.leadTime ?? "Instant confirmation",
    rating: parseNumber(input?.rating) ?? 4.8,
    inventoryCount: parseNumber(input?.inventory_count ?? input?.inventoryCount) ?? 1,
    locationId: parseNumber(input?.location_id) ?? locationData?.id,
    locationName: locationData?.name ?? input?.location_name ?? input?.location,
    locationCity: locationData?.city ?? input?.city,
    locationAddress: locationData?.address ?? input?.address,
    amenities: normalizeArray(input?.amenities),
    tags: normalizeArray(input?.tags),
    images: normalizeArray(input?.images),
    isFeatured: Boolean(input?.is_featured ?? input?.isFeatured),
    isActive: input?.is_active ?? input?.isActive ?? true,
  }
}

