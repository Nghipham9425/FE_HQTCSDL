export interface TcgCardListItemDto {
  cardId: string
  setId: string
  setName: string
  name: string
  cardNumber: string
  rarity?: string
  imageSmall?: string
  imageLarge?: string
}

export interface TcgCardDetailDto extends TcgCardListItemDto {
  series: string
  releaseDate: string
}

export interface TcgCardUpsertDto {
  cardId: string
  setId: string
  name: string
  cardNumber: string
  rarity?: string
  imageSmall?: string
  imageLarge?: string
}

export interface TcgCardPagedResponseDto {
  page: number
  pageSize: number
  total: number
  items: TcgCardListItemDto[]
}
