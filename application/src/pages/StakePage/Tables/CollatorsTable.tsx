// @ts-nocheck
import React, { useState } from 'react';
import { ColDef } from 'ag-grid-community';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useModal } from 'hooks';
import Button from 'components/Button';
import SortableTable from 'components/SortableTable';
import getTableHeight from 'utils/ui/getTableHeight';
import { useSubstrate } from 'contexts/substrateContext';
import { StakeModal } from '../Modals';
import { useStakeData } from '../StakeContext/StakeDataContext';
import { UnstakeModal } from '../Modals/UnstakeModal';
import StakeErrorDisplay from '../StakeErrorDisplay';
import CollatorDisplayCell from './CollatorDisplayCell';

const collatorStatusOptions = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

const dropdownStyles = () => {
  return {
    control: (provided) => ({
      ...provided,
      borderStyle: 'none',
      borderWidth: '0px',
      borderRadius: '8px',
      paddingBottom: '0.5rem',
      paddingTop: '0.5rem',
      boxShadow: '0 0 #0000',
      backgroundColor: 'transparent',
      width: '100%',
      cursor: 'pointer',
      color: 'white'
    }),
    input: (provided) => ({
      ...provided,
      fontSize: '1.125rem',
      paddingLeft: '0.6rem',
      minWidth: '0%',
      maxWidth: '100%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      cursor: 'pointer'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'var(--color-text-secondary)'
    })
  };
};

const CollatorsTable = () => {
  const { apiState } = useSubstrate();
  const {
    collatorCandidates,
    setSelectedCollator,
    unstakeRequests,
    userDelegations
  } = useStakeData();
  const {
    ModalWrapper: StakeModalWrapper,
    showModal: showStakeModal,
    hideModal: hideStakeModal
  } = useModal({ closeCallback: () => setSelectedCollator(null) });
  const {
    ModalWrapper: UnstakeModalWrapper,
    showModal: showUnstakeModal,
    hideModal: hideUnstakeModal
  } = useModal({ closeCallback: () => setSelectedCollator(null) });

  const nodeIsDisconnected =
    apiState === 'ERROR' || apiState === 'DISCONNECTED';

  const [filterText, setFilterText] = useState('');
  const [filterOption, setFilterOption] = useState(collatorStatusOptions[0]);

  const getApyEstimateString = (collator) => {
    if (!collator.apy) {
      return '-';
    } else {
      return `${collator.apy.toNumber().toLocaleString(undefined)} %`;
    }
  };

  const rowData = collatorCandidates
    .filter((collator) => {
      if (!filterText) {
        return true;
      }
      return (
        collator.name.includes(filterText) ||
        collator.address.startsWith(filterText)
      );
    })
    .filter((collator) => {
      if (filterOption.value === 'all') {
        return true;
      }
      if (filterOption.value === 'active') {
        return collator.isFunctionallyActive;
      }
      return !collator.isFunctionallyActive;
    })
    .map((collator) => {
      return {
        Collator: collator,
        'Amount Staked': collator.balanceEffectiveBonded,
        'Minimum Stake': collator.minStake,
        Delegations: collator.delegationCount,
        Status: collator.isFunctionallyActive ? 'Active' : '⚠️ Inactive',
        'APY Estimate': collator,
        data: collator
      };
    });

  const amountStakedTooltip = 'Total balance staked for this collator across all delegations';
  const minStakeTooltip =
    'Minimum stake required to earn staking rewards for this collator';
  const delegationTooltip =
    'Total stakers delegating to this node; only the top 100 stakers earn rewards';
  const apyEstimateTooltip = 'APY estimates are based on collator performance last round';
  const statusTooltip = 'Whether this collator is producing blocks and earning yield';

  const columnDefs: ColDef[] = [
    {
      field: 'Collator',
      sortable: false,
      width: 250,
      cellRenderer: (params: any) => {
        return <CollatorDisplayCell collator={params.data.Collator} />;
      },
      suppressMovable: true
    },
    {
      field: 'Amount Staked',
      unSortIcon: true,
      headerTooltip: amountStakedTooltip,
      suppressMovable: true,
      cellRenderer: (params: any) => {
        return params.data['Amount Staked'].toString(true, 0);
      },
      comparator: (valueA, valueB, nodeA, nodeB, isDescending) =>
        valueA.gt(valueB) ? 1 : -1
    },
    {
      field: 'Minimum Stake',
      unSortIcon: true,
      headerTooltip: minStakeTooltip,
      suppressMovable: true,
      cellRenderer: (params: any) => {
        return params.data['Minimum Stake'].toString(true, 0);
      },
      comparator: (valueA, valueB, nodeA, nodeB, isDescending) =>
        valueA.gt(valueB) ? 1 : -1
    },
    {
      field: 'APY Estimate',
      unSortIcon: true,
      headerTooltip: apyEstimateTooltip,
      suppressMovable: true,
      cellRenderer: (params: any) => {
        return getApyEstimateString(params.data['APY Estimate']);
      },
      comparator: (valueA, valueB, nodeA, nodeB, isDescending) =>
        valueA.apy.toNumber() > valueB.apy.toNumber() ? 1 : -1
    },
    {
      field: 'Status',
      unSortIcon: true,
      headerTooltip: statusTooltip,
      width: 175,
      suppressMovable: true
    },
    {
      field: 'Delegations',
      unSortIcon: true,
      headerTooltip: delegationTooltip,
      width: 175,
      suppressMovable: true,
      cellRenderer: (params: any) => {
        return `${params.data['Delegations']} / 100`;
      },
      comparator: (valueA, valueB, nodeA, nodeB, isDescending) =>
        valueA > valueB ? 1 : -1
    },
    {
      field: '',
      sortable: false,
      suppressMovable: true,
      width: 220,
      cellRenderer: (params: any) => {
        const collator = params.data.data;
        const unstakeRequest = unstakeRequests.find(
          (request) => request.collator.address === collator.address
        );
        const onClickStake = () => {
          setSelectedCollator(collator);
          showStakeModal();
        };
        const onClickUnstake = () => {
          setSelectedCollator(collator);
          showUnstakeModal();
        };
        const delegation = userDelegations.find((delegation) => {
          return delegation.collator.address === collator.address;
        });
        return (
          <div className="flex gap-6">
            {!unstakeRequest && (
              <Button
                className="btn-secondary flex items-center justify-start h-12"
                onClick={onClickStake}
              >
                Stake
              </Button>
            )}
            {delegation && !unstakeRequest && (
              <Button
                className="btn-thirdry flex items-center justify-center h-12"
                onClick={onClickUnstake}
              >
                Unstake
              </Button>
            )}
            {unstakeRequest && 'Unstaking in progress'}
          </div>
        );
      }
    }
  ];

  const onChangeOption = (option) => {
    setFilterOption(option);
  };

  return (
    <div className="mt-20" id="collatorsTable">
      <h1 className="text-base font-semibold text-black dark:text-white">
        Collators
      </h1>
      <div className="mt-6 flex space-x-5">
        <div className="p-3 rounded-md border border-manta-gray flex items-center gap-2 text-secondary bg-secondary">
          <input
            className="bg-transparent text-black dark:text-white outline-none"
            placeholder="Search Collators"
            onChange={(e) => setFilterText(e.target.value)}
            value={filterText}
          />
          <FontAwesomeIcon icon={faSearch} />
        </div>
        <div className="rounded-md border border-manta-gray flex items-center gap-2">
          <Select
            className="w-52 cursor-pointer bg-secondary rounded-md"
            options={collatorStatusOptions}
            styles={dropdownStyles()}
            placeholder=""
            value={filterOption}
            onChange={onChangeOption}
          />
        </div>
      </div>
      <div className="w-full mt-4">
        {nodeIsDisconnected ? (
          <StakeErrorDisplay />
        ) : (
          <SortableTable
            height={getTableHeight(rowData.length, 10)}
            columnDefs={columnDefs}
            rowData={rowData}
          />
        )}
      </div>
      <StakeModalWrapper>
        <StakeModal hideModal={hideStakeModal} />
      </StakeModalWrapper>
      <UnstakeModalWrapper>
        <UnstakeModal hideModal={hideUnstakeModal} />
      </UnstakeModalWrapper>
    </div>
  );
};

export default CollatorsTable;
