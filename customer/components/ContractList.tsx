import type { Languages } from '@helpwave/hightide/hooks/useLanguage'
import type { PropsForTranslation } from '@helpwave/hightide/hooks/useTranslation'
import { useTranslation } from '@helpwave/hightide/hooks/useTranslation'
import { useContractsForProductsQuery } from '@/api/mutations/contract_mutations'
import { LoadingAndErrorComponent } from '@helpwave/hightide/components/LoadingAndErrorComponent'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

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
        <div className="flex flex-col gap-y-1">
          <h3 className="text-lg font-semibold">{translation.contracts}</h3>
          {contracts.length === 0 ? (
            <span className="text-bg-gray-300">{translation.noContracts}</span>
          ) : (
            contracts.map(contract => (
              <Link
                href={contract.url}
                target="_blank"
                key={contract.uuid}
                className="inline-flex flex-row gap-x-2"
              >
                {contract.key}
                <span className="inline-flex flex-row items-center">
                  (
                  <div className="inline-flex flex-row items-center gap-x-0.5">
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
