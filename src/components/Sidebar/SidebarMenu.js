import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTxStatus } from 'contexts/txStatusContext';
import classNames from 'classnames';

const SidebarMenu = () => {
  const { txStatus } = useTxStatus();

  const onClickNavlink = (e) => {
    if (txStatus?.isProcessing()) {
      e.preventDefault();
    }
  };

  const navlinksDisabled = txStatus?.isProcessing();

  return (
    <div className="menu-content lg:py-16">
      {/* <NavLink
        className="text-secondary"
        activeClassName="text-primary active"
        to="/account"
      >
        <div className="py-2 w-full menu-content__item group flex items-center">
          <div className="p-3">
            <svg
              width="27"
              height="28"
              viewBox="0 0 27 28"
              className="fill-current lg:group-hover:fill-primary"
            >
              <path d="M13.4626 11.2C16.6491 11.2 19.2323 8.69279 19.2323 5.6C19.2323 2.50721 16.6491 0 13.4626 0C10.2761 0 7.69293 2.50721 7.69293 5.6C7.69293 8.69279 10.2761 11.2 13.4626 11.2Z" />
              <path d="M3 28C1.34315 28 -0.0362073 26.6378 0.350094 25.0266C1.73687 19.2427 7.08125 14.9333 13.4626 14.9333C19.844 14.9333 25.1884 19.2427 26.5752 25.0266C26.9615 26.6378 25.5821 28 23.9253 28H3Z" />
            </svg>
          </div>
          <span className="lg:group-hover:text-primary font-semibold">
            Account
          </span>
        </div>
      </NavLink> */}
      <NavLink
        onClick={onClickNavlink}
        className="text-secondary"
        activeClassName="text-primary active"
        to="/bridge"
      >
        <div
          className={classNames(
            'py-2 w-full menu-content__item group flex items-center',
            { disabled: navlinksDisabled }
          )}
        >
          <div className="p-3">
            <svg
              viewBox="0 0 32 32"
              width="32"
              className="fill-current -ml-1 mr-1 lg:group-hover:fill-primary"
              height="32"
            >
              <path d="M11.32 15.93C10.63 16.63 10.63 17.77 11.32 18.47C12 19.18 13.12 19.18 13.8 18.47L19.08 13.07C19.77 12.37 19.77 11.23 19.08 10.53L13.8 5.13C13.12 4.42 12 4.42 11.32 5.13C10.63 5.83 10.63 6.97 11.32 7.67L13.59 10L7.28 10L7.28 4.6C7.28 2.61 8.86 1 10.8 1L19.6 1C21.54 1 23.12 2.61 23.12 4.6L23.12 19C23.12 20.99 21.54 22.6 19.6 22.6L10.8 22.6C8.86 22.6 7.28 20.99 7.28 19L7.28 13.6L13.59 13.6L11.32 15.93Z" />
              <path d="M3.76 13.6C2.79 13.6 2 12.79 2 11.8C2 10.81 2.79 10 3.76 10L7.28 10L7.28 13.6L3.76 13.6Z" />
              <path d="M14.32 26.2C14.32 28.19 15.9 29.8 17.84 29.8L26.64 29.8C28.58 29.8 30.16 28.19 30.16 26.2L30.16 11.8C30.16 9.81 28.58 8.2 26.64 8.2L26.64 26.2L14.32 26.2Z" />
            </svg>
          </div>
          <span className="lg:group-hover:text-primary font-semibold">
            Bridge
          </span>
        </div>
      </NavLink>
      <NavLink
        onClick={onClickNavlink}
        className="text-secondary"
        activeClassName="text-primary active"
        to="/send"
      >
        <div
          className={classNames(
            'py-2 w-full menu-content__item group flex items-center',
            { disabled: navlinksDisabled }
          )}
        >
          <div className="p-3">
            <svg
              viewBox="0 0 32 32"
              width="32"
              className="fill-current -ml-1 mr-1 lg:group-hover:fill-primary"
              height="32"
            >
              <path d="M11.32 15.93C10.63 16.63 10.63 17.77 11.32 18.47C12 19.18 13.12 19.18 13.8 18.47L19.08 13.07C19.77 12.37 19.77 11.23 19.08 10.53L13.8 5.13C13.12 4.42 12 4.42 11.32 5.13C10.63 5.83 10.63 6.97 11.32 7.67L13.59 10L7.28 10L7.28 4.6C7.28 2.61 8.86 1 10.8 1L19.6 1C21.54 1 23.12 2.61 23.12 4.6L23.12 19C23.12 20.99 21.54 22.6 19.6 22.6L10.8 22.6C8.86 22.6 7.28 20.99 7.28 19L7.28 13.6L13.59 13.6L11.32 15.93Z" />
              <path d="M3.76 13.6C2.79 13.6 2 12.79 2 11.8C2 10.81 2.79 10 3.76 10L7.28 10L7.28 13.6L3.76 13.6Z" />
              <path d="M14.32 26.2C14.32 28.19 15.9 29.8 17.84 29.8L26.64 29.8C28.58 29.8 30.16 28.19 30.16 26.2L30.16 11.8C30.16 9.81 28.58 8.2 26.64 8.2L26.64 26.2L14.32 26.2Z" />
            </svg>
          </div>
          <span className="lg:group-hover:text-primary font-semibold">
            Send
          </span>
        </div>
      </NavLink>
      <NavLink
        onClick={onClickNavlink}
        className="text-secondary"
        activeClassName="text-primary active"
        to="/swap"
      >
        <div
          className={classNames(
            'py-2 w-full menu-content__item group flex items-center',
            { disabled: navlinksDisabled }
          )}
        >
          <div className="p-3">
            <svg
              width="30"
              height="28"
              viewBox="0 0 30 28"
              className="fill-current lg:group-hover:fill-primary"
            >
              <path
                d="M28.5052 7.28272L28.5052 7.28267L29.0593 6.6796C29.2179 6.50695 29.2174 6.24143 29.0581 6.0694L28.5062 5.47346L24.5172 0.994811C24.343 0.799225 24.0392 0.793157 23.8574 0.981634L22.7158 2.16464C22.5521 2.33429 22.5471 2.60154 22.7043 2.77722L24.7795 5.09597L12.7306 5.09597C10.0094 5.09597 7.80016 7.35427 7.80016 10.2072C7.80016 13.0643 10.0114 15.3185 12.7306 15.3185L13.1372 15.3185L16.9345 15.3185L17.2748 15.3185C18.7642 15.3185 19.8728 16.4618 19.8728 17.8667C19.8728 19.2058 18.7599 20.4167 17.2748 20.4167L5.17305 20.4167L7.42883 18.0278C7.59088 17.8562 7.5928 17.5885 7.43323 17.4146L6.35211 16.2363C6.17394 16.0421 5.86779 16.0419 5.68936 16.2359L1.56905 20.7145L0.9633 21.3091C0.78976 21.4795 0.782971 21.7569 0.94797 21.9356L1.49357 22.5263L1.49521 22.5281L5.55417 27.0096C5.72877 27.2023 6.02998 27.2074 6.21094 27.0206L7.28697 25.9096C7.45122 25.74 7.45649 25.4723 7.29905 25.2964L5.22404 22.9779L17.2748 22.9779C19.9914 22.9779 22.2715 20.7262 22.2715 17.8647C22.2715 15.0071 19.9896 12.7534 17.2748 12.7534L16.9363 12.7534L13.1372 12.7534L12.7306 12.7534C11.3192 12.7534 10.2024 11.5465 10.2024 10.2053C10.2024 8.79474 11.3148 7.65909 12.7306 7.65909L24.777 7.65909L22.6333 10.0493C22.4756 10.2252 22.4807 10.4931 22.6451 10.6628L23.7257 11.7787C23.9057 11.9646 24.2051 11.9607 24.3802 11.7701L28.5052 7.28272ZM5.14945 22.8946C5.14953 22.8947 5.14961 22.8948 5.14969 22.8949L5.14945 22.8946Z"
                strokeWidth="0.5"
              />
            </svg>
          </div>
          <span className="lg:group-hover:text-primary font-semibold">
            Swap (coming soon)
          </span>
        </div>
      </NavLink>
      <NavLink
        onClick={onClickNavlink}
        className="text-secondary"
        activeClassName="text-primary active"
        to="/govern"
      >
        <div
          className={classNames(
            'py-2 w-full menu-content__item group flex items-center',
            { disabled: navlinksDisabled }
          )}
        >
          <div className="p-3">
            <svg
              width="30"
              height="28"
              className="fill-current lg:group-hover:fill-primary"
              viewBox="0 0 30 28"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.893 0.837138C15.3396 0.520921 14.6602 0.520921 14.1069 0.837138L1.50687 8.03714C0.643736 8.53036 0.343862 9.6299 0.83708 10.493C1.16897 11.0738 1.77541 11.3996 2.39961 11.4003V24C1.4055 24 0.599609 24.8059 0.599609 25.8C0.599609 26.7941 1.4055 27.6 2.39961 27.6H27.5996C28.5937 27.6 29.3996 26.7941 29.3996 25.8C29.3996 24.8059 28.5937 24 27.5996 24V11.4003C28.224 11.3998 28.8308 11.074 29.1628 10.493C29.656 9.6299 29.3561 8.53036 28.493 8.03714L15.893 0.837138ZM7.79961 13.2C6.8055 13.2 5.99961 14.0059 5.99961 15V20.4C5.99961 21.3941 6.8055 22.2 7.79961 22.2C8.79372 22.2 9.59961 21.3941 9.59961 20.4V15C9.59961 14.0059 8.79372 13.2 7.79961 13.2ZM13.1996 15C13.1996 14.0059 14.0055 13.2 14.9996 13.2C15.9937 13.2 16.7996 14.0059 16.7996 15V20.4C16.7996 21.3941 15.9937 22.2 14.9996 22.2C14.0055 22.2 13.1996 21.3941 13.1996 20.4V15ZM22.1996 13.2C21.2055 13.2 20.3996 14.0059 20.3996 15V20.4C20.3996 21.3941 21.2055 22.2 22.1996 22.2C23.1937 22.2 23.9996 21.3941 23.9996 20.4V15C23.9996 14.0059 23.1937 13.2 22.1996 13.2Z"
              />
            </svg>
          </div>
          <span className="lg:group-hover:text-primary font-semibold">
            Govern (coming soon)
          </span>
        </div>
      </NavLink>
      {/* <NavLink className="text-secondary" activeClassName="text-primary active" to="/swap">
        <div className="py-2 w-full group menu-content__item flex items-center">
          <div className="p-3 ">
            <svg
              width="30"
              height="28"
              viewBox="0 0 30 28"
              className="fill-current lg:group-hover:fill-primary"
            >
              <path
                d="M28.5052 7.28272L28.5052 7.28267L29.0593 6.6796C29.2179 6.50695 29.2174 6.24143 29.0581 6.0694L28.5062 5.47346L24.5172 0.994811C24.343 0.799225 24.0392 0.793157 23.8574 0.981634L22.7158 2.16464C22.5521 2.33429 22.5471 2.60154 22.7043 2.77722L24.7795 5.09597L12.7306 5.09597C10.0094 5.09597 7.80016 7.35427 7.80016 10.2072C7.80016 13.0643 10.0114 15.3185 12.7306 15.3185L13.1372 15.3185L16.9345 15.3185L17.2748 15.3185C18.7642 15.3185 19.8728 16.4618 19.8728 17.8667C19.8728 19.2058 18.7599 20.4167 17.2748 20.4167L5.17305 20.4167L7.42883 18.0278C7.59088 17.8562 7.5928 17.5885 7.43323 17.4146L6.35211 16.2363C6.17394 16.0421 5.86779 16.0419 5.68936 16.2359L1.56905 20.7145L0.9633 21.3091C0.78976 21.4795 0.782971 21.7569 0.94797 21.9356L1.49357 22.5263L1.49521 22.5281L5.55417 27.0096C5.72877 27.2023 6.02998 27.2074 6.21094 27.0206L7.28697 25.9096C7.45122 25.74 7.45649 25.4723 7.29905 25.2964L5.22404 22.9779L17.2748 22.9779C19.9914 22.9779 22.2715 20.7262 22.2715 17.8647C22.2715 15.0071 19.9896 12.7534 17.2748 12.7534L16.9363 12.7534L13.1372 12.7534L12.7306 12.7534C11.3192 12.7534 10.2024 11.5465 10.2024 10.2053C10.2024 8.79474 11.3148 7.65909 12.7306 7.65909L24.777 7.65909L22.6333 10.0493C22.4756 10.2252 22.4807 10.4931 22.6451 10.6628L23.7257 11.7787C23.9057 11.9646 24.2051 11.9607 24.3802 11.7701L28.5052 7.28272ZM5.14945 22.8946C5.14953 22.8947 5.14961 22.8948 5.14969 22.8949L5.14945 22.8946Z"
                strokeWidth="0.5"
              />
            </svg>
          </div>
          <span className="lg:group-hover:text-primary font-semibold">Swap</span>
        </div>
      </NavLink>

      <NavLink className="text-secondary" activeClassName="text-primary active" to="/pool">
        <div className="py-2 w-full group menu-content__item flex items-center">
          <div className="p-3">
            <svg
              width="26"
              height="30"
              viewBox="0 0 26 30"
              className="fill-current lg:group-hover:fill-primary"
            >
              <path d="M0.399902 18.6V24C0.399902 26.9823 6.04111 29.4 12.9999 29.4C19.9587 29.4 25.5999 26.9823 25.5999 24V18.6C25.5999 21.5823 19.9587 24 12.9999 24C6.04111 24 0.399902 21.5823 0.399902 18.6Z" />
              <path d="M0.399902 9.59998V15C0.399902 17.9823 6.04111 20.4 12.9999 20.4C19.9587 20.4 25.5999 17.9823 25.5999 15V9.59998C25.5999 12.5823 19.9587 15 12.9999 15C6.04111 15 0.399902 12.5823 0.399902 9.59998Z" />
              <path d="M25.5999 5.99998C25.5999 8.98231 19.9587 11.4 12.9999 11.4C6.04111 11.4 0.399902 8.98231 0.399902 5.99998C0.399902 3.01764 6.04111 0.599976 12.9999 0.599976C19.9587 0.599976 25.5999 3.01764 25.5999 5.99998Z" />
            </svg>
          </div>
          <span className="lg:group-hover:text-primary font-semibold">Pool</span>
        </div>
      </NavLink>
      <NavLink className="text-secondary" activeClassName="text-primary active" to="/govern">
        <div className="py-2 w-full group menu-content__item flex items-center">
          <div className="p-3">
            <svg
              width="30"
              height="28"
              className="fill-current lg:group-hover:fill-primary"
              viewBox="0 0 30 28"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.893 0.837138C15.3396 0.520921 14.6602 0.520921 14.1069 0.837138L1.50687 8.03714C0.643736 8.53036 0.343862 9.6299 0.83708 10.493C1.16897 11.0738 1.77541 11.3996 2.39961 11.4003V24C1.4055 24 0.599609 24.8059 0.599609 25.8C0.599609 26.7941 1.4055 27.6 2.39961 27.6H27.5996C28.5937 27.6 29.3996 26.7941 29.3996 25.8C29.3996 24.8059 28.5937 24 27.5996 24V11.4003C28.224 11.3998 28.8308 11.074 29.1628 10.493C29.656 9.6299 29.3561 8.53036 28.493 8.03714L15.893 0.837138ZM7.79961 13.2C6.8055 13.2 5.99961 14.0059 5.99961 15V20.4C5.99961 21.3941 6.8055 22.2 7.79961 22.2C8.79372 22.2 9.59961 21.3941 9.59961 20.4V15C9.59961 14.0059 8.79372 13.2 7.79961 13.2ZM13.1996 15C13.1996 14.0059 14.0055 13.2 14.9996 13.2C15.9937 13.2 16.7996 14.0059 16.7996 15V20.4C16.7996 21.3941 15.9937 22.2 14.9996 22.2C14.0055 22.2 13.1996 21.3941 13.1996 20.4V15ZM22.1996 13.2C21.2055 13.2 20.3996 14.0059 20.3996 15V20.4C20.3996 21.3941 21.2055 22.2 22.1996 22.2C23.1937 22.2 23.9996 21.3941 23.9996 20.4V15C23.9996 14.0059 23.1937 13.2 22.1996 13.2Z"
              />
            </svg>
          </div>
          <span className="lg:group-hover:text-primary font-semibold">Govern</span>
        </div>
      </NavLink>
      <NavLink className="text-secondary" activeClassName="text-primary active" to="/audit">
        <div className="py-2 w-full group menu-content__item flex items-center">
          <div className="p-3">
            <svg
              width="24"
              height="30"
              className="fill-current lg:group-hover:fill-primary"
              viewBox="0 0 24 30"
            >
              <path d="M2.1999 3.92309C2.1999 2.01133 3.81168 0.461548 5.7999 0.461548H14.0543C15.0091 0.461548 15.9248 0.826245 16.5999 1.47541L22.7455 7.38463C23.4206 8.03379 23.7999 8.91425 23.7999 9.8323V24.6923C23.7999 26.6041 22.1881 28.1539 20.1999 28.1539H17.4499C19.16 26.3166 20.1999 23.8905 20.1999 21.2308C20.1999 15.4955 15.3646 10.8462 9.3999 10.8462C6.63383 10.8462 4.11063 11.846 2.1999 13.4904V3.92309Z" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.3999 14.3077C5.42345 14.3077 2.1999 17.4073 2.1999 21.2308C2.1999 22.5139 2.56403 23.7168 3.19704 24.7474L0.92711 26.93C0.224167 27.6059 0.224166 28.7018 0.92711 29.3777C1.63005 30.0536 2.76975 30.0536 3.47269 29.3777L5.74263 27.1951C6.81442 27.8037 8.06541 28.1539 9.3999 28.1539C13.3764 28.1539 16.5999 25.0543 16.5999 21.2308C16.5999 17.4073 13.3764 14.3077 9.3999 14.3077ZM5.7999 21.2308C5.7999 19.319 7.41168 17.7692 9.3999 17.7692C11.3881 17.7692 12.9999 19.319 12.9999 21.2308C12.9999 23.1425 11.3881 24.6923 9.3999 24.6923C8.40529 24.6923 7.50776 24.3068 6.85432 23.6785C6.20088 23.0501 5.7999 22.1871 5.7999 21.2308Z"
              />
            </svg>
          </div>
          <span className="lg:group-hover:text-primary font-semibold">Audit</span>
        </div>
      </NavLink>
      <NavLink className="text-secondary" activeClassName="text-primary active" to="/explore">
        <div className="py-2 w-full group menu-content__item flex items-center">
          <div className="p-3">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              className="fill-current lg:group-hover:fill-primary"
            >
              <path d="M12.25 12.25C12.25 10.317 13.817 8.75 15.75 8.75C17.683 8.75 19.25 10.317 19.25 12.25C19.25 14.183 17.683 15.75 15.75 15.75C14.783 15.75 13.9104 15.3602 13.2751 14.7249C12.6398 14.0896 12.25 13.217 12.25 12.25Z" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28ZM15.75 5.25C11.884 5.25 8.75 8.38401 8.75 12.25C8.75 13.5474 9.10401 14.7637 9.71944 15.8057L5.76256 19.7626C5.07915 20.446 5.07915 21.554 5.76256 22.2374C6.44598 22.9209 7.55402 22.9209 8.23744 22.2374L12.1943 18.2806C13.2363 18.896 14.4526 19.25 15.75 19.25C19.616 19.25 22.75 16.116 22.75 12.25C22.75 8.38401 19.616 5.25 15.75 5.25Z"
              />
            </svg>
          </div>
          <span className="lg:group-hover:text-primary font-semibold">Explore</span>
        </div>
      </NavLink> */}
    </div>
  );
};

export default SidebarMenu;
