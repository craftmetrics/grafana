// Libaries
import React, { PureComponent, FC, ReactNode } from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
// Utils & Services
import { playlistSrv } from 'app/features/playlist/PlaylistSrv';
// Components
import { DashNavTimeControls } from './DashNavTimeControls';
import { ButtonGroup, ModalsController, ToolbarButton, PageToolbar } from '@grafana/ui';
import { textUtil } from '@grafana/data';
// State
import { updateTimeZoneForSession } from 'app/features/profile/state/reducers';
// Types
import { DashboardModel } from '../../state';
import { KioskMode, StoreState } from 'app/types';
import { SaveDashboardModalProxy } from 'app/features/dashboard/components/SaveDashboard/SaveDashboardModalProxy';
import { locationService } from '@grafana/runtime';
import { toggleKioskMode } from 'app/core/navigation/kiosk';
import { getDashboardSrv } from '../../services/DashboardSrv';

export interface OwnProps {
  dashboard: DashboardModel;
  isFullscreen: boolean;
  kioskMode: KioskMode;
  hideTimePicker: boolean;
  folderTitle?: string;
  title: string;
  onAddPanel: () => void;
}

interface DispatchProps {
  updateTimeZoneForSession: typeof updateTimeZoneForSession;
}

interface DashNavButtonModel {
  show: (props: Props) => boolean;
  component: FC<Partial<Props>>;
  index?: number | 'end';
}

const customLeftActions: DashNavButtonModel[] = [];
const customRightActions: DashNavButtonModel[] = [];

export function addCustomLeftAction(content: DashNavButtonModel) {
  customLeftActions.push(content);
}

export function addCustomRightAction(content: DashNavButtonModel) {
  customRightActions.push(content);
}

type Props = OwnProps & DispatchProps;

class DashNav extends PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  onFolderNameClick = () => {
    locationService.partial({ search: 'open', folder: 'current' });
  };

  onClose = () => {
    locationService.partial({ viewPanel: null });
  };

  onToggleTVMode = () => {
    toggleKioskMode();
  };

  onOpenSettings = () => {
    locationService.partial({ editview: 'settings' });
  };

  onStarDashboard = () => {
    const { dashboard } = this.props;
    const dashboardSrv = getDashboardSrv();

    dashboardSrv.starDashboard(dashboard.id, dashboard.meta.isStarred).then((newState: any) => {
      dashboard.meta.isStarred = newState;
      this.forceUpdate();
    });
  };

  onPlaylistPrev = () => {
    playlistSrv.prev();
  };

  onPlaylistNext = () => {
    playlistSrv.next();
  };

  onPlaylistStop = () => {
    playlistSrv.stop();
    this.forceUpdate();
  };

  onDashboardNameClick = () => {
    locationService.partial({ search: 'open' });
  };

  addCustomContent(actions: DashNavButtonModel[], buttons: ReactNode[]) {
    actions.map((action, index) => {
      const Component = action.component;
      const element = <Component {...this.props} key={`button-custom-${index}`} />;
      typeof action.index === 'number' ? buttons.splice(action.index, 0, element) : buttons.push(element);
    });
  }

  isPlaylistRunning() {
    return playlistSrv.isPlaying;
  }

  renderLeftActionsButton() {
    const { kioskMode } = this.props;
    const buttons: ReactNode[] = [];

    if (kioskMode !== KioskMode.Off || this.isPlaylistRunning()) {
      return [];
    }

    this.addCustomContent(customLeftActions, buttons);
    return buttons;
  }

  renderPlaylistControls() {
    return (
      <ButtonGroup key="playlist-buttons">
        <ToolbarButton tooltip="Go to previous dashboard" icon="backward" onClick={this.onPlaylistPrev} narrow />
        <ToolbarButton onClick={this.onPlaylistStop}>Stop playlist</ToolbarButton>
        <ToolbarButton tooltip="Go to next dashboard" icon="forward" onClick={this.onPlaylistNext} narrow />
      </ButtonGroup>
    );
  }

  renderTimeControls() {
    const { dashboard, updateTimeZoneForSession, hideTimePicker } = this.props;

    if (hideTimePicker) {
      return null;
    }

    return (
      <DashNavTimeControls dashboard={dashboard} onChangeTimeZone={updateTimeZoneForSession} key="time-controls" />
    );
  }

  renderRightActionsButton() {
    const { dashboard, onAddPanel, isFullscreen, kioskMode } = this.props;
    const { canEdit, showSettings } = dashboard.meta;
    const { snapshot } = dashboard;
    const snapshotUrl = snapshot && snapshot.originalUrl;
    const buttons: ReactNode[] = [];

    if (this.isPlaylistRunning()) {
      return [this.renderPlaylistControls(), this.renderTimeControls()];
    }

    if (kioskMode === KioskMode.TV) {
      return [this.renderTimeControls()];
    }

    if (canEdit && !isFullscreen) {
      buttons.push(<ToolbarButton tooltip="Add panel" icon="panel-add" onClick={onAddPanel} key="button-panel-add" />);
      buttons.push(
        <ModalsController key="button-save">
          {({ showModal, hideModal }) => (
            <ToolbarButton
              tooltip="Save dashboard"
              icon="save"
              onClick={() => {
                showModal(SaveDashboardModalProxy, {
                  dashboard,
                  onDismiss: hideModal,
                });
              }}
            />
          )}
        </ModalsController>
      );
    }

    if (snapshotUrl) {
      buttons.push(
        <ToolbarButton
          tooltip="Open original dashboard"
          onClick={() => this.gotoSnapshotOrigin(snapshotUrl)}
          icon="link"
          key="button-snapshot"
        />
      );
    }

    if (showSettings) {
      buttons.push(
        <ToolbarButton tooltip="Dashboard settings" icon="cog" onClick={this.onOpenSettings} key="button-settings" />
      );
    }

    this.addCustomContent(customRightActions, buttons);

    buttons.push(this.renderTimeControls());
    return buttons;
  }

  gotoSnapshotOrigin(snapshotUrl: string) {
    window.location.href = textUtil.sanitizeUrl(snapshotUrl);
  }

  render() {
    const { isFullscreen, title } = this.props;
    const onGoBack = isFullscreen ? this.onClose : undefined;

    return (
      <PageToolbar
        pageIcon={undefined}
        title={title}
        onClickTitle={this.onDashboardNameClick}
        onGoBack={onGoBack}
        leftItems={this.renderLeftActionsButton()}
      >
        {this.renderRightActionsButton()}
      </PageToolbar>
    );
  }
}

const mapStateToProps = (state: StoreState) => ({});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, OwnProps> = {
  updateTimeZoneForSession,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashNav);
