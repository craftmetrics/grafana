// Libraries
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
// Components
import Page from 'app/core/components/Page/Page';
import PageActionBar from 'app/core/components/PageActionBar/PageActionBar';
import EmptyListCTA from 'app/core/components/EmptyListCTA/EmptyListCTA';
import DataSourcesList from './DataSourcesList';
// Types
import { DataSourceSettings, NavModel, LayoutMode } from '@grafana/data';
import { IconName } from '@grafana/ui';
import { StoreState } from 'app/types';
// Actions
import { loadDataSources } from './state/actions';
import { getNavModel } from 'app/core/selectors/navModel';

import {
  getDataSources,
  getDataSourcesCount,
  getDataSourcesLayoutMode,
  getDataSourcesSearchQuery,
} from './state/selectors';
import { setDataSourcesLayoutMode, setDataSourcesSearchQuery } from './state/reducers';

export interface Props {
  navModel: NavModel;
  dataSources: DataSourceSettings[];
  dataSourcesCount: number;
  layoutMode: LayoutMode;
  searchQuery: string;
  hasFetched: boolean;
  loadDataSources: typeof loadDataSources;
  setDataSourcesLayoutMode: typeof setDataSourcesLayoutMode;
  setDataSourcesSearchQuery: typeof setDataSourcesSearchQuery;
}

const emptyListModel = {
  title: 'No data sources defined',
  buttonIcon: 'database' as IconName,
  buttonLink: 'datasources/new',
  buttonTitle: 'Add data source',
};

export class DataSourcesListPage extends PureComponent<Props> {
  componentDidMount() {
    this.props.loadDataSources();
  }

  render() {
    const {
      dataSources,
      dataSourcesCount,
      navModel,
      layoutMode,
      searchQuery,
      setDataSourcesSearchQuery,
      hasFetched,
    } = this.props;

    const linkButton = {
      href: 'datasources/new',
      title: 'Add data source',
    };

    return (
      <Page navModel={navModel}>
        <Page.Contents isLoading={!hasFetched}>
          <>
            {hasFetched && dataSourcesCount === 0 && <EmptyListCTA {...emptyListModel} />}
            {hasFetched &&
              dataSourcesCount > 0 && [
                <PageActionBar
                  searchQuery={searchQuery}
                  setSearchQuery={(query) => setDataSourcesSearchQuery(query)}
                  linkButton={linkButton}
                  key="action-bar"
                />,
                <DataSourcesList dataSources={dataSources} layoutMode={layoutMode} key="list" />,
              ]}
          </>
        </Page.Contents>
      </Page>
    );
  }
}

function mapStateToProps(state: StoreState) {
  return {
    navModel: getNavModel(state.navIndex, 'datasources'),
    dataSources: getDataSources(state.dataSources),
    layoutMode: getDataSourcesLayoutMode(state.dataSources),
    dataSourcesCount: getDataSourcesCount(state.dataSources),
    searchQuery: getDataSourcesSearchQuery(state.dataSources),
    hasFetched: state.dataSources.hasFetched,
  };
}

const mapDispatchToProps = {
  loadDataSources,
  setDataSourcesSearchQuery,
  setDataSourcesLayoutMode,
};

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(DataSourcesListPage));
