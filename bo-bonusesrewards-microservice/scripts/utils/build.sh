#!/bin/bash
script_dir=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

while [[ $# -gt 0 ]]; do
  case "$1" in
    --branch)
        P_BRANCH=$2
        shift
        shift
        ;;
    --app-image)
        P_APP_IMAGE=$2
        shift
        shift
        ;;
    --app-version)
        P_APP_VERSION=$2
        shift
        shift
        ;;
  esac
done

if [[ "" == "${P_BRANCH}" ]] ; then
    P_BRANCH="master"
fi

. "${script_dir}/env/${P_BRANCH}.env"

if [[ "" == "${P_ACTION}" ]] ; then
    P_ACTION="build"
fi

if [[ "" == "${P_APP_IMAGE}" ]] ; then
    P_APP_IMAGE="${ENV_APP_IMAGE}"
fi

if [[ "" == "${P_APP_VERSION}" ]] ; then
    P_APP_VERSION="${ENV_APP_VERSION}"
fi

if [[ "build" == "${P_ACTION}" ]] ; then
    cd "${script_dir}/../.."
    podman build -f Dockerfile -t "${P_APP_IMAGE}:${P_APP_VERSION}" .
fi