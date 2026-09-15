export const QUERY_KEYS = {
  product:  { list: 'productList',  detail: 'productDetail'  },
  category: { list: 'categoryList', detail: 'categoryDetail' },
  voucher:  { list: 'voucherList'                             },
  order:    { list: 'orderList',    detail: 'orderDetail'    },
  banner:   { list: 'bannerList'                              },
  trustBar: { list: 'trustBarList'                            },
  showcase: { detail: 'showcaseDetail'                        },
} as const;
