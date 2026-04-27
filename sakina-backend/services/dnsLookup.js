const dns = require('dns');
const { Resolver } = dns;
const resolver = new Resolver();
resolver.setServers(['8.8.8.8', '8.8.4.4']);

/**
 * Custom DNS lookup function to bypass broken system DNS (standard on some routers)
 */
const customLookup = (hostname, options, callback) => {
  // If options is a function, it's the callback
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  // Use resolver.resolve4 for Atlas
  resolver.resolve4(hostname, (err, addresses) => {
    if (err || !addresses.length) {
      // Fallback to standard lookup if Google DNS fails or for non-IPv4
      return dns.lookup(hostname, options, callback);
    }
    // Return the first IP found
    callback(null, addresses[0], 4);
  });
};

module.exports = customLookup;
