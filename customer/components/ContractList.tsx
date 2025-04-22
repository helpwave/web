import type { Languages } from '@helpwave/common/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/common/hooks/useTranslation'
import { useTranslation } from '@helpwave/common/hooks/useTranslation'
import { useContractsForProductsQuery } from '@/api/mutations/contract_mutations'
import { LoadingAndErrorComponent } from '@helpwave/common/components/LoadingAndErrorComponent'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { tw } from '@twind/core'

type ContractListTranslation = {
  contracts: string,
  noContracts: string,
  show: string,
}

const defaultContractListTranslations: Record<Languages, ContractListTranslation> = {
  en: {
    contracts: 'Contracts',
    noContracts: 'No Contracts',
    show: 'Show'
  },
  de: {
    contracts: 'Verträge',
    noContracts: 'Keine Verträge',
    show: 'Anzeigen'
  }
}

export type ContractListProps = {
  productIds: string[],
}

export const ContractList = ({
                               productIds,
                               overwriteTranslation
                             }: PropsForTranslation<ContractListTranslation, ContractListProps>) => {
  const translation = useTranslation(defaultContractListTranslations, overwriteTranslation)
  const {
    data: contracts,
    isLoading,
    isError,
  } = useContractsForProductsQuery(productIds)

  return (
    <LoadingAndErrorComponent isLoading={isLoading} hasError={isError}>
      {contracts && (
        <div className={tw('flex flex-col gap-y-1')}>
          <h3 className={tw('text-lg font-semibold')}>{translation.contracts}</h3>
          {contracts.length === 0 ? (
            <span className={tw('text-bg-gray-300')}>{translation.noContracts}</span>
          ) : (
            contracts.map(contract => (
              <Link
                href={contract.url}
                target="_blank"
                key={contract.uuid}
                className={tw('inline-flex flex-row gap-x-2')}
              >
                {contract.key}
                <span className={tw('inline-flex flex-row items-center')}>
                  (
                  <div className={tw('inline-flex flex-row items-center gap-x-0.5')}>
                    {`${translation.show}`}
                    <ExternalLink size={16}/>
                  </div>
                  )
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </LoadingAndErrorComponent>
  )
}
