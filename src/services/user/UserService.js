const
    SequelizeService = require('feathers-sequelize').Service,
    {locator} = require('locator.js'),
    errors = require('feathers-errors');

class UserService extends SequelizeService {

  constructor () {
    const Models = locator.get('Models');
    const sqlEngine = locator.get('sqlEngine');

    super({
      Model: Models.User
    });
    this.Models = Models;
    this.sqlEngine = sqlEngine;

    // Hooks
    // -----
    this.before = {};

    this.after = {};
  }

  retrieveUserAndAllSubscribedPodcasts (id, params={}) {
    const {MediaRef, Playlist} = this.Models;

    if (id !== params.userId) {
      throw new errors.Forbidden();
    }

    return this.sqlEngine.query(`
      SELECT p.title, p."imageUrl", p.id, p."lastEpisodeTitle", (
        SELECT MAX("pubDate") FROM episodes WHERE "podcastId"=p.id
      ) AS "lastEpisodePubDate"
      FROM "feedUrls" f, users u, podcasts p
      WHERE u.id='${id}'
      AND u."subscribedPodcastFeedUrls" @> ARRAY[f.url]::text[]
      AND p.id=f."podcastId"
      AND f."isAuthority"=true;
    `, { type: this.sqlEngine.QueryTypes.SELECT })
    .then(subscribedPodcasts => {

      return this.Model.findOne({
        where: {
          id:id
        }
      }).then(user => {
        user.dataValues.subscribedPodcasts = subscribedPodcasts;
        return user;
      }).catch(e => {
        return new errors.GeneralError(e);
      });

    })
    .catch(e => {
      console.log(e);
      return new errors.GeneralError(e);
    });
  }

  get (id, params={}) {
    const {MediaRef, Playlist} = this.Models;

    if (id !== params.userId) {
      throw new errors.Forbidden();
    }

    // By default, include all the user's Subscribed Playlists and Playlist Items.
    return this.Model.findOne({
      where: {
        id:id
      },
      include: [{
        model: Playlist,
        through: 'subscribedPlaylists',
        include: [{
          model: MediaRef,
          through: 'playlistItems'
        }]
      }]
    }).then(user => {
      return user
    }).catch(e => {
      return new errors.GeneralError(e);
    });

  }

  create (data, params={}) {
    const {Playlist} = this.Models;

    return this.Model.findOrCreate({
      where: {
        id: params.userId
      },
      defaults: {
        name: data.name || '',
        nickname: data.nickname || '',
        subscribedPodcastFeedUrls: data.subscribedPodcastFeedUrls || []
      },
      include: {
        model: Playlist,
        through: 'subscribedPlaylists'
      }
    })
    .then(user => {
      // TODO: I might be doing something wrong here. Basically I would like to do
      // getOrCreate so the returned object isn't in an array, but seems like that doesn't exist.
      return user[0];
    })
    .catch(e => {
      console.log(e);
      new errors.GeneralError(e);
    });
  }

  update (id, data, params={}) {

    if (id !== params.userId) {
      throw new errors.Forbidden();
    }

    return this.Model.findById(id)
      .then(user => {

        // Handle subscribing to a podcast
        if (params.subscribeToPodcastFeedUrl || params.unsubscribeFromPodcastFeedUrl) {
          let subscribedPodcastFeedUrls = user.dataValues.subscribedPodcastFeedUrls || [];

          let podcastFeedUrl = params.subscribeToPodcastFeedUrl || params.unsubscribeFromPodcastFeedUrl || null;

          var regexp = /^(https?):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
          if (!regexp.test(podcastFeedUrl)) {
            throw errors.GeneralError('A valid http or https URL must be provided.');
          }

          // Handle subscribing from a podcast
          if (params.subscribeToPodcastFeedUrl) {
            if (subscribedPodcastFeedUrls.indexOf(podcastFeedUrl) === -1) {
              subscribedPodcastFeedUrls.push(podcastFeedUrl);
            }
          }

          // Handle unsubscribing from a podcast
          if (params.unsubscribeFromPodcastFeedUrl) {
            if (subscribedPodcastFeedUrls.indexOf(podcastFeedUrl) > -1) {
              let index = subscribedPodcastFeedUrls.indexOf(podcastFeedUrl);
              subscribedPodcastFeedUrls.splice(index, 1);
            }
          }

          return user.update({ subscribedPodcastFeedUrls: subscribedPodcastFeedUrls })
            .then(() => {
              return podcastFeedUrl;
            });
        }

        // Handle subscribing to a playlist
        if (params.subscribeToPlaylist) {
          return user.addPlaylists([params.subscribeToPlaylist])
            .then(() => {
              return params.subscribeToPlaylist
            });
        }

        // Handle unsubscribing from a playlist
        if (params.unsubscribeFromPlaylist) {
          return user.removePlaylist([params.unsubscribeFromPlaylist])
            .then(() => {
              return params.unsubscribeToPlaylist
            });
        }

      });

  }

  patch (id, data, params={}) {

    if (id !== params.userId) {
      throw new errors.Forbidden();
    }

    var fieldsToUpdate = {
      'name': data.name
    };

    if (fieldsToUpdate.length < 1) {
      throw new errors.GeneralError('There must be a valid property to update.')
    }

    return this.Model.update(fieldsToUpdate, {
      where: {
        id: id
      }
    })
      .then(user => {
        const {Playlist} = this.Models,
              PlaylistService = locator.get('PlaylistService');

        return Playlist.update({ ownerName: data.name }, { where: { ownerId: params.userId } });
      })
  }

}

UserService.prototype.find = undefined;
UserService.prototype.remove = undefined;

module.exports = UserService;
